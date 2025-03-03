"use client"

import {
    createProductCategory,
    updateProductCategory,
} from "@/redux/features/productCategory/reducer"
import { useAppDispatch } from "@/redux/hooks"
import {
    IProductCategoryRequest,
    IProductCategoryUpdate,
    IProductCategoryDetail,
} from "@/types/productCategory"
import { ACTIONS, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import { yupResolver } from "@hookform/resolvers/yup"
import { Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"
import {
    FormActions,
    MultiLanguages,
    RadioGroupField,
    InputField,
} from "@/views/DynamicComponent/DynamicComponent"
import UploadFileField from "@/components/Form/UploadFileField"
interface IProductCategoryForm {
    id?: string
    initialValue?: IProductCategoryDetail
    action: string
}

const ProductCategoryForm = (props: IProductCategoryForm) => {
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
            sort: yup.number().typeError(itemIsInvalidType).optional(),

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
        formState: { isSubmitting, isDirty, isValid },
    } = useForm({
        resolver: yupResolver<any>(ItemSchema),
        defaultValues: {
            enabled: true,
        },
    })

    const onSubmit = async (data: IProductCategoryRequest) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        if (action === ACTIONS.create) {
            const value = await dispatch(createProductCategory(data as IProductCategoryRequest))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const value = await dispatch(
                updateProductCategory({ ...data, id } as IProductCategoryUpdate),
            )
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
                            <InputField
                                control={control}
                                name="sort"
                                label={t("common.sort")}
                                id="sort"
                                type="number"
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
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <UploadFileField
                                control={control}
                                name={`thumbnailId`}
                                label="Thumbnail"
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

export default ProductCategoryForm
