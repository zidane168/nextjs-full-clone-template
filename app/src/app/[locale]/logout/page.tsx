'use client';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { store } from "@/redux/store";
import { signOut } from '@/redux/features/auth/reducer';

const Logout = () => {
    const dispatch = useAppDispatch();
    const query = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        dispatch(signOut(store));

        const redirectUrl = query.get('redirectUrl');
        router.push(`/login${redirectUrl && redirectUrl !== '' ? `?redirectUrl=${redirectUrl}` : ''}`);
    })

    return <></>;
};

export default Logout;
