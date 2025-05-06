import { authClient } from "@/lib/auth-client";
import { changePasswordSchema } from "@/utils/interfaces/schemas";
import { Button, ButtonGroup } from "@heroui/button";
import { Input } from "@heroui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ChangePasswod {
	password: string;
	repeat_password: string;
	new_password: string;
}

export default function ChangePasswod() {
	const form = useForm<ChangePasswod>({
		resolver: yupResolver(changePasswordSchema),
		shouldUseNativeValidation: true,
		progressive: true,
	});

	const onSubmit = async (data: ChangePasswod) => {
		if (data.new_password !== data.repeat_password) {
			return toast.error("Las contraseñas no coinciden");
		}

		return toast.promise(
			authClient.changePassword({
				newPassword: data.new_password,
				currentPassword: data.password,
				revokeOtherSessions: true, // revoke all other sessions the user is signed into
			}),
			{
				success: "Contraseña cambiada con éxito",
				error: "Error al cambiar la contraseña",
				loading: "Cambiando contraseña...",
			},
		);
	};

	return (
		<form
			className="flex flex-col gap-3 w-1/2 border-content2 bg-content1 p-4 rounded-xl shadow-md"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<Input placeholder="Contraseña actual" type="password" />
			<Input placeholder="Nueva contraseña" type="password" />
			<Input placeholder="Repetir contraseña" type="password" />

			<ButtonGroup className="mt-4 self-end">
				<Button color="primary">Cambiar contraseña</Button>
				<Button color="secondary" variant="flat">
					Cancelar
				</Button>
			</ButtonGroup>
		</form>
	);
}
