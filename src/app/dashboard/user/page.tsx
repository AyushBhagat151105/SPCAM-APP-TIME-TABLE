
import React from 'react';
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import Navbar from "@/components/navbar";

const UserPage
    =async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session){
        return redirect('/');
    }

    const user = await session?.user;
    return (
        <div>
            {/*<Navbar />*/}
            <ul>
                <li>{user?.role}</li>
                <li>{user?.name}</li>
                <li>{user?.email}</li>
            </ul>
        </div>
    );
};

export default UserPage
;
