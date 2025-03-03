"use client"

import { createCompany, updateCompany } from "@/redux/features/company/reducer"
import { useAppDispatch } from "@/redux/hooks"
import { ICompany, ICompanyCreate, ICompanyUpdate } from "@/types/company"
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
interface ICompanyForm {
    id?: string
    initialValue?: ICompany | ICompanyCreate
    action: string
}

const CompanyForm = (props: ICompanyForm) => {
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
            content: LanguageValidation,
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
        })
        .required()

    const multiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
        {
            name: "content",
            type: MULTI_LANGUAGE_FIELD.RICHTEXT,
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
    const onSubmit = async (data: ICompanyCreate) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        if (action === ACTIONS.create) {
            const value = await dispatch(createCompany(data as ICompanyCreate))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const value = await dispatch(updateCompany({ ...data, id } as ICompanyUpdate))
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
                                name="coverImageId"
                                isNeedToCheckDimension
                                label={t("common.coverImage")}
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

export default CompanyForm
