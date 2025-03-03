'use client';

import { useEffect } from 'react';
import { selectAuthUser } from '@/redux/features/auth/reducer';
import { useAppSelector } from '@/redux/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface AuthProps {
    children?: any;
    locale: string;
}

export function Auth(props: AuthProps) {
    const { children, locale } = props;
    const user = useAppSelector(selectAuthUser);
    const pathname = usePathname();
    const query = useSearchParams();
    const router = useRouter();
    const loginPath = '/login';
    const policyPathEN = '/policy/en';
    const policyPathTC = '/policy/tc';
    const policyPathSC = '/policy/sc';
    const logoutPath = '/logout';

    useEffect(() => {
        const nonAuthPath = [loginPath, policyPathEN, policyPathTC, policyPathSC];
        let originalPathname = pathname;
        var prefix = `/${locale}`;
        if (originalPathname.indexOf(prefix) === 0) {
            originalPathname = originalPathname.replace(prefix, '');
        }
        if (originalPathname !== logoutPath) {
            if (originalPathname === loginPath) {
                if (user) {
                    const redirectUrl = query.get('redirectUrl');
                    router.push(redirectUrl ?? '/');
                }
            } else if (!nonAuthPath.includes(originalPathname)){ 
                if (!user) { 
                    const arrQueries = []
                    for (const [key, value] of query.entries()) {
                        arrQueries.push(`${key}=${value}`);
                    }
                    const redirectUrl = encodeURIComponent(`${pathname}?${arrQueries.join('&')}`);
                    router.push(`/login${redirectUrl && redirectUrl !== '' ? `?redirectUrl=${redirectUrl}` : ''}`);
                }
            }
        }
    }, [user, pathname, router, query, locale]);

    return children;
}
