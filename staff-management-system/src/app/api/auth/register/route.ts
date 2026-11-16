import { hash } from "bcryptjs";
import { createUser, findUserByEmail } from "@/lib/user-store";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "All fields are required." }), {
        status: 400,
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return new Response(JSON.stringify({ message: "Email already registered." }), {
        status: 409,
      });
    }

    const hashedPassword = await hash(password, 10);
    await createUser({ email, name: name || email.split("@")[0], passwordHash: hashedPassword });

    return new Response(JSON.stringify({ message: "User registered successfully!" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return new Response(
      JSON.stringify({ message: "Something went wrong. Please try again later." }),
      { status: 500 },
    );
  }
}
