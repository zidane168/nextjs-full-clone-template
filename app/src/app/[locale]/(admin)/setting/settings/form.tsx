"use client"

import { updateSetting } from "@/redux/features/setting/reducer"
import { useAppDispatch } from "@/redux/hooks"
import { ISettingUpdateRequest, ISettingFormData, ISetting } from "@/types/setting"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import { yupResolver } from "@hookform/resolvers/yup"
import { Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"
import { FormActions, RadioGroupField } from "@/views/DynamicComponent/DynamicComponent"
import InputField from "@/components/Form/InputField"
interface ISettingForm {
    id: string
    initialValue?: ISetting
    action: string
}

const SettingForm = (props: ISettingForm) => {
    const t = useTranslations()
    const { id, initialValue, action } = props
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const requireMessage = t("validation.itemIsRequiredField")

    const ItemSchema = yup
        .object()
        .shape({
            value: yup.mixed().required(requireMessage),
        })
        .required()

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty },
    } = useForm({
        resolver: yupResolver<any>(ItemSchema),
    })

    const onSubmit = async (data: ISettingFormData) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        const { value } = data
        const updateData = { value } as ISettingUpdateRequest
        const result = await dispatch(updateSetting({ ...updateData, id }))
        if (!(result as any)?.error) {
            toast.success(t("message.itemIsUpdateSuccessful"))
            backMainPage(pathname, action, router)
        }
    }

    useEffect(() => {
        reset(initialValue)
    }, [initialValue])

    return (
        <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {initialValue?.type === "BOOLEAN" ? (
                        <RadioGroupField
                            name="value"
                            control={control}
                            label={t("setting.value")}
                            options={[
                                { label: t("common.true"), value: true },
                                {
                                    label: t("common.false"),
                                    value: false,
                                },
                            ]}
                        />
                    ) : (
                        <InputField
                            name="value"
                            control={control}
                            label={t("setting.value")}
                            type={initialValue?.type === "NUMBER" ? "number" : "text"}
                        />
                    )}
                </Grid>
            </Grid>
            <FormActions
                backMainPage={() => backMainPage(pathname, action, router)}
                isSubmitting={isSubmitting}
            />
        </form>
    )
}

export default SettingForm
