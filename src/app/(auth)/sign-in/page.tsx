"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signInFormSchema } from "@/lib/auth-schema";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { FaSignInAlt } from "react-icons/fa";

export default function SignIn() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const { email, password } = values;
    if (!email || !password) {
      toast({
        title: "Email and password are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: `/dashboard`,
        },
        {
          onRequest: () => {
            toast({
              title: "Authenticating...",
            });
          },
          onSuccess: () => {
            form.reset();
          },
          onError: (ctx) => {
            toast({
              title: ctx.error.message,
              variant: "destructive",
            });
            form.setError("email", {
              type: "manual",
              message: ctx.error.message,
            });
          },
        },
      );
    } catch (error) {
      console.error("Sign-in error:", error);
      toast({
        title: "An error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FaSignInAlt className="mr-2" />
          Sign In
        </CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
