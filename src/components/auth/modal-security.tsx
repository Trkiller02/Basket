"use client";

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import QRCode from "react-qr-code";

export default function ModalSecurity({
	isOpenProp,
	setIsOpenAction,
	data,
}: {
	isOpenProp: boolean;
	setIsOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
	data?: { password: string; restore_code: string; name: string };
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure({
		isOpen: isOpenProp,
		onClose: () => setIsOpenAction(false),
	});

	return (
		<Modal
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<h1 className="text-2xl font-bold">
								Código de seguridad
								<span className="text-sm text-default-500 block">
									Guarde esto en un lugar seguro
								</span>
							</h1>
						</ModalHeader>
						<ModalBody className="flex items-center justify-center">
							<QRCode
								value={
									data
										? `Hola, ${data.name} \n Recuperación: ${data.restore_code} \n ${data.password ? `Contraseña: ${data.password}` : ""}`
										: ""
								}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" onPress={onClose}>
								Cerrar
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
