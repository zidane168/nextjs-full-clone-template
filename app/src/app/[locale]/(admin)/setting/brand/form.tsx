"use client"

import { createBrand, updateBrand } from "@/redux/features/brand/reducer"
import { useAppDispatch } from "@/redux/hooks"
import { IBrand, IBrandCreateRequest, IBrandFormData, IBrandUpdateRequest } from "@/types/brand"
import { ACTIONS, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import {
    FormActions,
    MultiLanguages,
    RadioGroupField,
    UploadFileField,
} from "@/views/DynamicComponent/DynamicComponent"
import { yupResolver } from "@hookform/resolvers/yup"
import { Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"
interface IBrandForm {
    id?: string
    initialValue?: IBrand
    action: string
}

const BrandForm = (props: IBrandForm) => {
    const t = useTranslations()
    const { id, initialValue, action } = props
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const requireMessage = t("validation.itemIsRequiredField")

    const LanguageValidation = yup
        .object()
        .shape({
            tc: yup.string().required(requireMessage),
            en: yup.string().required(requireMessage),
            sc: yup.string().required(requireMessage),
        })
        .required()

    const ItemSchema = yup
        .object()
        .shape({
            name: LanguageValidation,
            typeName: LanguageValidation,
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
        })
        .required()

    const multiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
        {
            name: "typeName",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
    ]

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty, isValid },
    } = useForm({
        resolver: yupResolver<any>(ItemSchema),
        defaultValues: {
            enabled: true,
        },
    })

    const onSubmit = async (data: IBrandFormData) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        if (action === ACTIONS.create) {
            const value = await dispatch(createBrand(data as IBrandCreateRequest))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const value = await dispatch(updateBrand({ ...data, id } as IBrandUpdateRequest))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }
    useEffect(() => {
        reset(initialValue)
    }, [initialValue])

    return (
        <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MultiLanguages control={control} fields={multiLangFields} />
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <UploadFileField
                                control={control}
                                name="thumbnailId"
                                label={t("common.thumbnail")}
                                canUploadVideo={false}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
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
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <FormActions
                isValid={isValid}
                backMainPage={() => backMainPage(pathname, action, router)}
                isSubmitting={isSubmitting}
            />
        </form>
    )
}

export default BrandForm
