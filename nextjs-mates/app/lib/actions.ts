'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { getID } from './auth-utils';
import { AuthError } from 'next-auth';
import { MateMP, Venta, VentaMateUsuario } from '@/app/lib/definitions';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// Esquema de validación para Mates (Zod)
const MateSchema = z.object({
    id: z.string(),
    nombre: z.string().min(1, 'Por favor ingrese un nombre'),
    material: z.string().min(1, 'Por favor ingrese un material'),
    color: z.string().min(1, 'Por favor ingrese un color'),
    precio: z
        .coerce
        .number({
            invalid_type_error: 'Por favor ingrese un número válido',
        })
        .int({ message: 'El precio debe ser un número entero' })
        .gt(0, { message: 'Por favor ingrese un precio mayor a 0' }),
    imagen: z
        .string()
        .min(1, 'Por favor ingrese una imagen')
        .refine((nombre) => /\.(jpg|jpeg|png|gif|webp)$/i.test(nombre), {
            message: 'La imagen debe tener formato JPG, JPEG, PNG, GIF o WEBP',
        }),
    estado: z.enum(['disponible', 'dado de baja'], { message: 'Por favor seleccione un estado' }),
});


const CreateMate = MateSchema.omit({ id: true });

export type MateState = {
    errors?: {
        nombre?: string[];
        material?: string[];
        color?: string[];
        precio?: string[];
        imagen?: string[];
        estado?: string[];
    };
    message?: string | null;
};

// Validación de registro de usuario
const UserSchema = z.object({
    id: z.string(),
    nombre: z.string().min(1, 'Por favor ingrese un nombre'),
    email: z.string().email('Por favor ingrese un correo electrónico válido'),
    password: z.string().min(6, 'Por favor ingrese una contraseña de al menos 6 caracteres'),
    rol: z.enum(['admin', 'user']),
});

const CreateUser = UserSchema.omit({ id: true, rol: true });

export type UserState = {
    errors?: {
        nombre?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    message?: string | null;
};

// Registro de usuario
export async function registerUser(prevState: UserState, formData: FormData): Promise<UserState> {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validamos los campos usando zod
    const validatedFields = CreateUser.safeParse({
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        password,
    });

    if (!validatedFields.success) {
        return {
            errors: {
                ...validatedFields.error.flatten().fieldErrors,
            },
            message: 'Faltan campos o hay errores de validación.',
        };
    }

    if (password !== confirmPassword) {
        return {
            errors: {
                confirmPassword: ['Las contraseñas no coinciden'],
            },
            message: 'Las contraseñas no coinciden.',
        };
    }

    const { nombre, email } = validatedFields.data;

    try {
        const res = await fetch(`${baseUrl}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password }),
        });

        if (!res.ok) {
            const data = await res.json();
            return {
                message: data?.error || 'Error al registrar usuario.',
            };
        }
    } catch (error) {
        console.error('Error en el servidor o red:', error);
        return {
            message: 'Error de red o servidor.',
        };
    }

    redirect('/login');
}

// Crear un mate nuevo
export async function createMate(prevState: MateState, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateMate.safeParse({
        nombre: formData.get('nombre'),
        material: formData.get('material'),
        color: formData.get('color'),
        precio: formData.get('precio'),
        imagen: formData.get('imagen'),
        estado: formData.get('estado'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        //Log errors and message to the console for debugging
        console.error(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Mate.',
        };
    }
    const { nombre, material, color, precio, imagen, estado } = validatedFields.data;
    // Insert data into the database 
    try {
        fetch(`${baseUrl}/api/mates`, {
            method: 'POST',
            body: JSON.stringify({
                nombre,
                material,
                color,
                precio,
                vendidos: 0, // Default value for new mates
                imagen,
                estado,
            }),
        });
    } catch {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Mate.',
        };
    }

    revalidatePath('/elsurenouniversitario/admin/mates');
    redirect('/elsurenouniversitario/admin/mates');
}

// Actualizar mate
const UpdateMate = MateSchema.omit({ id: true });

export async function updateMate(id: string, prevState: MateState, formData: FormData) {
    const validatedFields = UpdateMate.safeParse({
        nombre: formData.get('nombre'),
        material: formData.get('material'),
        color: formData.get('color'),
        precio: formData.get('precio'),
        imagen: formData.get('imagen'),
        estado: formData.get('estado'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        //Log errors and message to the console for debugging
        console.error(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Mate.',
        };
    }

    const { nombre, material, color, precio, imagen, estado } = validatedFields.data;

    try {
        fetch(`${baseUrl}/api/mates`, {
            method: 'PUT',
            body: JSON.stringify({
                id,
                nombre,
                material,
                color,
                precio,
                imagen,
                estado,
            }),
        });
    } catch {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Update Mate.',
        };
    }
    revalidatePath('/elsurenouniversitario/admin/mates');
    redirect('/elsurenouniversitario/admin/mates');
}

// Eliminar mate
export async function deleteMate(id: string) {
    try {
        fetch(`${baseUrl}/api/mates`, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    } catch {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Delete Mate.',
        };
    }
    revalidatePath('/elsurenouniversitario/admin/mates');
}

// Autenticación con credenciales
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales inválidas.';
                default:
                    return 'Algo salió mal.';
            }
        }
        throw error;
    }
}

// Crear preferencia de pago con MercadoPago
export async function comprarMate(matesMP: MateMP[]) {
    try {
        const idUser = await getID();
        const response = await fetch(`${baseUrl}/api/mp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matesMP, idUser }),
        });

        if (!response.ok) {
            throw new Error(`Error al crear preferencia: ${response.status}`);
        }

        const { init_point: initPoint } = await response.json();
        return initPoint!;
    } catch (error) {
        console.error("Error al generar preferencia:", error);
    }
}

// Crear una venta
export async function crearVenta(venta: Venta, ventaMatesUsuario: VentaMateUsuario[]) {
    try {
        const response = await fetch(`${baseUrl}/api/ventas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ venta, ventaMatesUsuario }),
        });

        if (!response.ok) {
            throw new Error(`Error al crear venta: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al crear venta:", error);
    }
}

// Enviar notificación push a un topic
export async function sendNotification(titulo: string, cuerpo: string) {
    try {
        const response = await fetch(`${baseUrl}/api/firebase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic: 'ofertas',
                title: titulo,
                body: cuerpo
            })
        });
        if (!response.ok) {
            throw new Error(`Error al enviar notificación: ${response.status}`);
        }
        const data = await response.json();
        console.log("NOTIFICACION:", data);
        return data;
    }
    catch (error) {
        console.error("Error al enviar notificación:", error);
    }
}

// Suscribirse a un topic
export async function subscribeToTopic(tokens: string[], topic: string) {
    try {
        const response = await fetch(`${baseUrl}/api/firebase/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens, topic })
        });

        if (!response.ok) throw new Error(`Error al suscribirse al tema: ${response.status}`);

        const data = await response.json();
        console.log("SUBSCRIPCIÓN:", data);
        return data;
    } catch (error) {
        console.error("Error al suscribirse al tema:", error);
        return { success: false };
    }
}

// Verificar si un token está suscripto a un topic
export async function checkSubscription(token: string) {
    try {
        const response = await fetch(`${baseUrl}/api/firebase/checksubscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        if (!response.ok) throw new Error(`Error al verificar la suscripción: ${response.status}`);

        const data = await response.json();
        console.log("VERIFICACIÓN DE SUSCRIPCIÓN:", data);
        return data;
    } catch (error) {
        console.error("Error al verificar la suscripción:", error);
        return { isSubscribed: false };
    }
}

// Desuscribirse de un topic
export async function unsubscribeFromTopic(token: string) {
    try {
        const response = await fetch(`${baseUrl}/api/firebase/unsubscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        if (!response.ok) throw new Error(`Error al desuscribirse del tema: ${response.status}`);

        const data = await response.json();
        console.log("DESUSCRIPCIÓN:", data);

        return data;
    } catch (error) {
        console.error("Error al desuscribirse del tema:", error);
        return { success: false };
    }
}



