'use client'
import { useAppSelector } from "@/redux/hooks"
import { IPermissionContainer, IPermissionSub } from "@/types/user";

export type PermissionName = {
    container: IPermissionContainer["container"],
    subject: IPermissionSub["subject"],
    action: string
}

const usePermission = () => {
    const userPermission = useAppSelector(state => state.auth.user?.permissions || []);

    const canAccess = (name: PermissionName) => {
        const containerIndex = userPermission?.findIndex((user:any) => user.container === name.container)
        const subjectIndex = userPermission[containerIndex as number].subjects.findIndex((sub:any) => sub.subject === name.subject);
        return userPermission[containerIndex].subjects[subjectIndex].actions.some((act:any) => act === name.action);
    }

    return {
        canAccess
    }
}

export default usePermission;