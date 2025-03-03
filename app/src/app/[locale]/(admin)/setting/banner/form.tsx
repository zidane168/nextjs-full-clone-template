"use client"

import { createBanner, updateBanner } from "@/redux/features/banner/reducer"
import { useAppDispatch } from "@/redux/hooks"
import { ISelectOption } from "@/types/common"
import {
    IBanner,
    IBannerCreateRequest,
    IBannerUpdateRequest,
    IBannerFormData,
} from "@/types/banner"
import { ACTIONS, BANNER_MODULE_TYPE, BANNER_TYPE, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"
import {
    FormActions,
    UploadFileField,
    InputField,
    MultiLanguages,
    SelectField,
    RadioGroupField,
} from "@/views/DynamicComponent/DynamicComponent"

interface IBannerForm {
    id?: string
    initialValue?: IBanner
    action: string
}

const BannerForm = (props: IBannerForm) => {
    const t = useTranslations()
    const { id, initialValue, action } = props
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const requireMessage = t("validation.itemIsRequiredField")
    const itemIsInvalidType = t("validation.itemIsInvalidType")

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
            module: yup.string().typeError(requireMessage).required(requireMessage),
            type: yup.string().typeError(requireMessage).required(requireMessage),
            urlId: yup.mixed().required(requireMessage),
            sort: yup
                .number()
                .transform((value, originalValue) => {
                    return originalValue === "" ? null : value
                })
                .typeError(itemIsInvalidType)
                .required(requireMessage),
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
        })
        .required()

    const multiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
    ]

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty },
    } = useForm({
        resolver: yupResolver<any>(ItemSchema),
        defaultValues: {
            enabled: true,
        },
    })

    const onSubmit = async (data: IBannerFormData) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        const { name, type, sort, urlId, enabled, module } = data
        const createData: IBannerCreateRequest = {
            name,
            type,
            module,
            sort,
            urlId,
            enabled,
        }

        if (action === ACTIONS.create) {
            const value = await dispatch(createBanner(createData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const hasUpdatedUrlId = typeof urlId !== "string"
            const updateData = {
                ...createData,
                urlId: hasUpdatedUrlId ? urlId : "",
                id,
            } as IBannerUpdateRequest
            const value = await dispatch(updateBanner(updateData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }

    const getBannerTypes = () => {
        return Object.entries(BANNER_TYPE).map(([key, value]) => {
            return {
                label: t(`banner.${value}`),
                value: key,
            } as ISelectOption
        })
    }

    useEffect(() => {
        let newInitialValue = initialValue
        if (initialValue !== undefined) {
            newInitialValue = { ...initialValue, urlId: initialValue.url }
        }
        reset(newInitialValue)
    }, [initialValue])

    return (
        <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            padding: "10px",
                            border: "1px solid #ddd",
                            marginBottom: "10px",
                        }}>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <SelectField
                                    control={control}
                                    defaultValue=""
                                    name="type"
                                    label={t("common.type")}
                                    options={getBannerTypes()}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <SelectField
                                    control={control}
                                    defaultValue=""
                                    name="module"
                                    label={t("common.module")}
                                    options={BANNER_MODULE_TYPE}
                                />
                            </Grid>
                        </Grid>
                        <MultiLanguages control={control} fields={multiLangFields} />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <UploadFileField
                                    control={control}
                                    name="urlId"
                                    label={t("banner.urlId")}
                                    canUploadVideo={false}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <InputField
                                    control={control}
                                    name="sort"
                                    label={t("banner.sort")}
                                    id="sort"
                                />
                            </Grid>
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
                    </Box>
                </Grid>
            </Grid>
            <FormActions
                backMainPage={() => backMainPage(pathname, action, router)}
                isSubmitting={isSubmitting}
            />
        </form>
    )
}

export default BannerForm
