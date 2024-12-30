import React from 'react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import {authClient} from "@/lib/auth-client";
import {Button} from "@/components/ui/button";

const AdminPage = async () => {
    // Fetch session details
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Redirect to the home page if no session is found
    if (!session) {
        return redirect('/');
    }

    const user = session?.user;

    // Redirect to the dashboard if the user is not an admin
    if (!user || user.role !== 'admin') {
        return redirect('/dashboard');
    }



    // Render the admin page if the user is an admin
    return (
        <div>
            <Navbar />
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <ul className="list-disc pl-5">
                <li>Role: {user.role}</li>
                <li>Name: {user.name}</li>
                <li>Email: {user.email}</li>
            </ul>
            {/*<Button onClick={ async () => {*/}
            {/*    "use server"*/}
            {/*    const users = await authClient.admin.listUsers({*/}
            {/*        query: {*/}
            {/*            searchField: "email",*/}
            {/*            searchOperator: "contains",*/}
            {/*            searchValue: "@example.com",*/}
            {/*            limit: 10,*/}
            {/*            offset: 0,*/}
            {/*            sortBy: "createdAt",*/}
            {/*            sortDirection: "desc",*/}
            {/*            filterField: "role",*/}
            {/*            filterOperator: "eq",*/}
            {/*            filterValue: "admin"*/}
            {/*        }*/}
            {/*    });*/}

            {/*    console.log(users)*/}
            {/*    // console.log(user?.role);*/}

            {/*}}>List user</Button>*/}
        </div>
    );
};

export default AdminPage;
