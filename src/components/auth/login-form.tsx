import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InputForm } from "../form/input";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const form = useForm();

	return (
		<Form {...form}>
			<form className={cn("flex flex-col gap-6", className)} {...props}>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">Iniciar sesión</h1>
					<p className="text-muted-foreground text-sm text-balance">
						Ingrese su correo ó C.I. a continuación para iniciar sesión en su
						cuenta
					</p>
				</div>
				<div className="grid gap-6">
					<InputForm
						name="email"
						label="Correo electrónico o C.I:"
						placeholder="m@example.com"
						required
					/>
					<div className="grid gap-3">
						<InputForm name="password" label="Contraseña:" required />
						<div className="flex items-center">
							<a
								href="/session/recuperar"
								className="ml-auto text-sm underline-offset-4 hover:underline"
							>
								¿Olvido su contraseña?
							</a>
						</div>
					</div>
					<Button type="submit" className="w-full">
						Ingresar
					</Button>
				</div>
				<div className="text-center text-sm">
					¿No tienes una cuenta? <br />
					<a
						href={`mailto:${process.env.EMAIL_COMPANY}`}
						className="underline underline-offset-4"
					>
						Ponte en contacto con nosotros
					</a>
				</div>
			</form>
		</Form>
	);
}
