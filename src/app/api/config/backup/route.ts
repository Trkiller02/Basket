import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    let sqlBackup = `-- Backup de Base de Datos PostgreSQL\n`
    sqlBackup += `-- Generado el: ${new Date().toISOString()}\n`
    sqlBackup += `-- ==========================================\n\n`

    // Obtener todas las tablas de la base de datos
    const tablesResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)

    const tables = tablesResult.rows.map((row) => row.table_name as string)

    for (const tableName of tables) {
      try {
        sqlBackup += `-- Tabla: ${tableName}\n`
        sqlBackup += `-- ==========================================\n`

        // Obtener estructura de la tabla
        const columnsResult = await db.execute(sql`
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length
          FROM information_schema.columns 
          WHERE table_name = ${tableName}
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `)

        // Crear statement CREATE TABLE
        sqlBackup += `DROP TABLE IF EXISTS "${tableName}" CASCADE;\n`
        sqlBackup += `CREATE TABLE "${tableName}" (\n`

        const columns = columnsResult.rows.map((col: any) => {
          let columnDef = `  "${col.column_name}" ${col.data_type}`

          if (col.character_maximum_length) {
            columnDef += `(${col.character_maximum_length})`
          }

          if (col.is_nullable === "NO") {
            columnDef += " NOT NULL"
          }

          if (col.column_default) {
            columnDef += ` DEFAULT ${col.column_default}`
          }

          return columnDef
        })

        sqlBackup += columns.join(",\n")
        sqlBackup += `\n);\n\n`

        // Obtener datos de la tabla
        const dataResult = await db.execute(sql.raw(`SELECT * FROM "${tableName}"`))

        if (dataResult.rows.length > 0) {
          const columnNames = columnsResult.rows.map((col: any) => `"${col.column_name}"`)
          sqlBackup += `-- Datos para la tabla ${tableName}\n`

          for (const row of dataResult.rows) {
            const values = columnNames.map((colName) => {
              const cleanColName = colName.replace(/"/g, "")
              const value = (row as any)[cleanColName]

              if (value === null) {
                return "NULL"
              } else if (typeof value === "string") {
                return `'${value.replace(/'/g, "''")}'`
              } else if (typeof value === "boolean") {
                return value ? "TRUE" : "FALSE"
              } else if (value instanceof Date) {
                return `'${value.toISOString()}'`
              } else {
                return String(value)
              }
            })

            sqlBackup += `INSERT INTO "${tableName}" (${columnNames.join(", ")}) VALUES (${values.join(", ")});\n`
          }
          sqlBackup += `\n`
        }

        // Obtener constraints y índices
        const constraintsResult = await db.execute(sql`
          SELECT 
            tc.constraint_name,
            tc.constraint_type,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          LEFT JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
          WHERE tc.table_name = ${tableName}
          AND tc.table_schema = 'public'
          AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE')
        `)

        if (constraintsResult.rows.length > 0) {
          sqlBackup += `-- Constraints para la tabla ${tableName}\n`

          for (const constraint of constraintsResult.rows) {
            const constraintData = constraint as any

            if (constraintData.constraint_type === "PRIMARY KEY") {
              sqlBackup += `ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintData.constraint_name}" PRIMARY KEY ("${constraintData.column_name}");\n`
            } else if (constraintData.constraint_type === "FOREIGN KEY") {
              sqlBackup += `ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintData.constraint_name}" FOREIGN KEY ("${constraintData.column_name}") REFERENCES "${constraintData.foreign_table_name}"("${constraintData.foreign_column_name}");\n`
            } else if (constraintData.constraint_type === "UNIQUE") {
              sqlBackup += `ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintData.constraint_name}" UNIQUE ("${constraintData.column_name}");\n`
            }
          }
          sqlBackup += `\n`
        }

        sqlBackup += `\n`
      } catch (error) {
        console.error(`Error al procesar tabla ${tableName}:`, error)
        sqlBackup += `-- ERROR: No se pudo procesar la tabla ${tableName}\n\n`
      }
    }

    sqlBackup += `-- Fin del backup\n`
    sqlBackup += `-- ==========================================\n`

    // Configurar headers para descarga
    const headers = new Headers()
    headers.set("Content-Type", "application/sql")
    headers.set("Content-Disposition", `attachment; filename="backup_${new Date().toISOString().split("T")[0]}.sql"`)

    return new NextResponse(sqlBackup, { headers })
  } catch (error) {
    console.error("Error al crear backup SQL:", error)
    return NextResponse.json({ error: "Error al crear el backup SQL de la base de datos" }, { status: 500 })
  }
}
