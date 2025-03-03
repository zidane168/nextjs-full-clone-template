'use client';
import { Breadcrumbs, Typography } from '@mui/material';
import { usePathname } from 'next-intl/client';
import Link from 'next/link';

const menuItems = [
    { text: 'Adminstrators', slug: 'admins' },
    { text: 'Permissions', slug: 'permissions' },
    { text: 'Roles', slug: 'roles' },
    { text: 'Members', slug: 'all_members' },
    { text: 'Member points', slug: 'member_points' },
    { text: 'Invoices', slug: 'member_invoices' },
];

export const MyBreadcrumbs = () => {
    const pathname = usePathname();
    const defineBreadcrumbs = () => {
        const arr = pathname.split('/');
        const crumb = arr.pop();
        return menuItems.find((item) => item.slug === crumb)?.text;
    };
    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link href="/">Dashboard</Link>
            {defineBreadcrumbs() && (
                <Typography color="text.primary">
                    {defineBreadcrumbs()}
                </Typography>
            )}
        </Breadcrumbs>
    );
};
