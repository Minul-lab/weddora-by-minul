import { getUsers } from '@/lib/api/users';
import React from 'react';

const page = () => {
    const users = getUsers();
    console.log(users);
    return (
        <div>
            user page
        </div>
    );
};

export default page;