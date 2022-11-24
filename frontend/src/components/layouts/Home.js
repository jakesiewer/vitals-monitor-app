import React from 'react'

import GoogleMaps from '../maps/GoogleMaps'

import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
    const { currentUser } = useAuth();

    return (
        // <>
        //     {currentUser && (
                <GoogleMaps />
        //     )}
        // </>
    );
}