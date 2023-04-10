import React from 'react'
import { useRouter } from 'next/router';

export default function Song() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div>
            <h1>Song</h1>
            <h2>{id}</h2>
        </div>
    )
}