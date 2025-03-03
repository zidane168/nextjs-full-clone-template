'use client'
import usePermission, { PermissionName } from "@/hooks/usePermission"

type PermissionGuardProps = {
    children: any
    name: PermissionName
  }
  
  const PermissionGuard = (props: PermissionGuardProps) => {
    const { children, name } = props
    const { canAccess } = usePermission()
  
    return canAccess(name) ? children : <div>Permission Denied</div>
  }
  
  export default PermissionGuard