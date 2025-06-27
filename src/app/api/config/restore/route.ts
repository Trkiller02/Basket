import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("sqlFile") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    if (!file.name.endsWith(".sql")) {
      return NextResponse.json({ error: "El archivo debe tener extensión .sql" }, { status: 400 })
    }

    // Leer el contenido del archivo
    const sqlContent = await file.text()

    if (!sqlContent.trim()) {
      return NextResponse.json({ error: "El archivo SQL está vacío" }, { status: 400 })
    }

    // Dividir el contenido en statements individuales
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    let executedStatements = 0
    const errors: string[] = []

    // Ejecutar cada statement
    for (const statement of statements) {
      try {
        if (statement.trim()) {
          await db.execute(sql.raw(statement))
          executedStatements++
        }
      } catch (error: any) {
        const errorMsg = `Error en statement ${executedStatements + 1}: ${error.message}`
        errors.push(errorMsg)
        console.error(errorMsg)

        // Si es un error crítico, detener la ejecución
        if (error.message.includes("syntax error") || error.message.includes("does not exist")) {
          break
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Restore completado. ${executedStatements} statements ejecutados correctamente.`,
      executedStatements,
      totalStatements: statements.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    console.error("Error durante el restore:", error)
    return NextResponse.json(
      {
        error: "Error durante el proceso de restore",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
