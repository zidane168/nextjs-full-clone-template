import { Box, Stack, Grid } from "@mui/material"
import { IRole, IRoleCreateUpdateForm, IRoleUpdateRequest } from "@/types/role"
import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import { ACTIONS } from "@/utils/constants"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { createRole, updateRole } from "@/redux/features/role/reducer"
import { toast } from "react-toastify"
import { selectPermissions } from "@/redux/features/permission/reducer"
import {
    FormActions,
    InputField,
    PermissionAccordion,
    RadioGroupField,
} from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"

interface IRoleForm {
    initialValue: IRole
    id?: string
    onEdit: boolean
    action: string
}

export default function RoleForm(props: IRoleForm) {
    const { initialValue, id, onEdit, action } = props
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const permissions = useAppSelector(selectPermissions)

    const requireMessage = t("validation.itemIsRequiredField")

    const RoleSchema = yup
        .object()
        .shape({
            title: yup.string().required(requireMessage),
            description: yup.string().required(requireMessage),
            permissions: yup.array().of(yup.string()).optional().nullable(),
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
        })
        .required()

    const methods = useForm({
        resolver: yupResolver<any>(RoleSchema),
        defaultValues: {
            enabled: true,
        },
    })

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isDirty },
        reset,
    } = methods

    const onSubmit = async (data: IRoleCreateUpdateForm) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        const { title, description, permissions, enabled } = data
        const createData = {
            title,
            description,
            permissions,
            enabled,
        } as IRoleCreateUpdateForm
        if (action === ACTIONS.create) {
            const value = await dispatch(createRole(createData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const updateData = { ...createData, id: id } as IRoleUpdateRequest
            const value = await dispatch(updateRole(updateData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }

    useEffect(() => {
        if (initialValue) {
            reset({
                ...initialValue,
                permissions: initialValue.permissions?.map(item => item.id.toString()) ?? [],
            })
        }
    }, [initialValue, reset])

    return (
        <div>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    marginBottom: "10px",
                                }}>
                                <FormActions
                                    backMainPage={() => backMainPage(pathname, action, router)}
                                    isSubmitting={isSubmitting}
                                />
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    spacing={2}
                                    sx={{ width: "100%" }}>
                                    <InputField
                                        name="title"
                                        id="roleTitle"
                                        control={control}
                                        label="Title"
                                        disabled={onEdit ? true : false}
                                    />
                                    <InputField
                                        name="description"
                                        id="roleDescription"
                                        control={control}
                                        label="Description"
                                    />
                                    <RadioGroupField
                                        name="enabled"
                                        control={control}
                                        label={t("common.isActive")}
                                        options={[
                                            { label: t("common.enabled"), value: true },
                                            {
                                                label: t("common.disabled"),
                                                value: false,
                                            },
                                        ]}
                                    />
                                </Stack>
                                <PermissionAccordion
                                    data={permissions}
                                    rolePermissions={initialValue.permissions}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </div>
    )
}
