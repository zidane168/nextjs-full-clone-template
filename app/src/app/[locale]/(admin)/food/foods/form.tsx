"use client"

import SelectField from "@/components/Form/SelectField"
import UploadFileField from "@/components/Form/UploadFileField"
import { useAppDispatch } from "@/redux/hooks"
import { ACTIONS, LANGUAGE_INIT_DATA, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import {
    backMainPage,
    checkFormIsDirtyAndNavigateBack,
    extractMediasObjects,
} from "@/utils/helpers/common"
import {
    FormActions,
    InputField,
    MultiLanguages,
    RadioGroupField,
} from "@/views/DynamicComponent/DynamicComponent"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Grid } from "@mui/material"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"
import CustomImage from "@/components/Form/CustomImage"
import DatePickerField from "@/components/Form/DatePickerField"
import { createFood, updateFood } from "@/redux/features/food/reducer"
import { IDetailExtra, IExtra, IFood, IFoodCreateRequest, IFoodUpdateRequest } from "@/types/food"
import { useFetchFoodCategory } from "@/utils/hooks/useFetchFoodCategory"
import ExtraFields from "./components/ExtraFields"
import AddIcon from "@mui/icons-material/Add"

interface IFoodForm {
    id?: string
    initialValue?: IFood
    action: string
}

const FoodForm = (props: IFoodForm) => {
    const [deleteMediaIds, setDeleteMediaIds] = useState<number[]>([])
    const t = useTranslations()
    const { id, initialValue, action } = props
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const requireMessage = t("validation.itemIsRequiredField")
    const itemIsInvalidType = t("validation.itemIsInvalidType")
    const unpublishDateValidate = t("validation.unpublishDateValidate")
    const minRequireMessage = t("validation.itemIsGreaterThanZero")
    const itemIsEqualOrGreaterThanZero = t("validation.itemIsEqualOrGreaterThanZero")
    const selectBrandFirstToSelectCategory = t("validation.selectBrandFirstToSelectCategory")
    const itemMin1 = t("validation.itemMin1")
    const itemIsInteger = t("validation.itemIsInteger")

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
            categoryId: yup
                .number()
                .transform((value, originalValue) => {
                    return originalValue === "" ? null : value
                })
                .when("brandId", {
                    is: (brandId: number) => brandId !== null,
                    then: schema => schema.required(requireMessage),
                    otherwise: schema => schema.required(selectBrandFirstToSelectCategory),
                }),
            published: yup.date().typeError(itemIsInvalidType).required(requireMessage),
            unpublished: yup
                .date()
                .min(yup.ref("published"), unpublishDateValidate)
                .typeError(itemIsInvalidType)
                .required(requireMessage),
            price: yup
                .number()
                .transform((value, originalValue) => {
                    return originalValue === "" ? null : value
                })
                .min(1, minRequireMessage)
                .typeError(itemIsInvalidType)
                .required(requireMessage),
            discount: yup.number().typeError(itemIsInvalidType).nullable().optional(),
            popular: yup.boolean().typeError(requireMessage).required(requireMessage),
            bestSeller: yup.boolean().typeError(requireMessage).required(requireMessage),
            sort: yup
                .number()
                .transform((value, originalValue) => {
                    return originalValue === "" ? null : value
                })
                .optional()
                .nullable(),
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
            medias: yup.array().nullable().optional(),
            isHaveExtras: yup.boolean().typeError(requireMessage).required(requireMessage),
            extras: yup
                .array()
                .of(
                    yup.object().shape({
                        name: LanguageValidation,
                        reqOpt: yup.boolean().typeError(requireMessage).required(requireMessage),
                        limit: yup
                            .number()
                            .integer(itemIsInteger)
                            .transform((value, originalValue) =>
                                originalValue === "" ? null : value,
                            )
                            .min(1, minRequireMessage)
                            .typeError(itemIsInvalidType)
                            .required(requireMessage),
                        sort: yup
                            .number()
                            .transform((value, originalValue) => {
                                return originalValue === "" ? null : value
                            })
                            .optional()
                            .nullable(),
                        details: yup
                            .array()
                            .of(
                                yup.object().shape({
                                    name: LanguageValidation,
                                    price: yup
                                        .number()
                                        .transform((value, originalValue) => {
                                            return originalValue === "" ? null : value
                                        })
                                        .min(0, itemIsEqualOrGreaterThanZero)
                                        .typeError(itemIsInvalidType)
                                        .required(requireMessage),
                                    sort: yup
                                        .number()
                                        .transform((value, originalValue) => {
                                            return originalValue === "" ? null : value
                                        })
                                        .optional()
                                        .nullable(),
                                }),
                            )
                            .min(1, itemMin1)
                            .required(requireMessage),
                    }),
                )
                .when("isHaveExtras", {
                    is: (value: boolean) => value === true,
                    then: schema => schema.min(1, itemMin1).required(requireMessage),
                    otherwise: schema => schema.optional().nullable(),
                }),
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
    const locale = useLocale()

    const initDetailExtra = {
        name: LANGUAGE_INIT_DATA,
        price: 0,
        sort: 0,
    } as IDetailExtra

    const initExtra = {
        name: LANGUAGE_INIT_DATA,
        details: [initDetailExtra],
        reqOpt: false,
        limit: 1,
        sort: 0,
    } as IExtra

    const formMethods = useForm({
        resolver: yupResolver<any>(ItemSchema),
        defaultValues: {
            enabled: true,
            isHaveExtras: true,
        },
    })

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        getValues,
        formState: { isSubmitting, isDirty, errors },
    } = formMethods

    const {
        fields: extrasFields,
        append: appendExtra,
        remove: removeExtra,
        replace: replaceExtra,
    } = useFieldArray({
        control,
        name: "extras",
    })

    const {
        fields: fieldsMedias,
        append: appendMedias,
        remove: removeMedias,
    } = useFieldArray({
        control,
        name: "mediaIds",
    })

    const {
        fields: fieldsUpdatedMedia,
        append: appendUpdatedMedia,
        remove: removeUpdatedMedia,
    } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "deleteMediaIds", // unique name for your Field Array
    })

    const selectedBrand = watch("brandId")
    const isHaveExtras = watch("isHaveExtras")

    const categories = useFetchFoodCategory(locale)

    const handleRemoveCurrentFoodImages = (
        { id, url, initId }: { id: string; url: string; initId: string },
        index: number,
    ) => {
        let clone = [...deleteMediaIds]
        clone.push(Number(initId))
        setDeleteMediaIds([...clone])
        removeUpdatedMedia(index)
    }
    const onSubmit = async (data: IFoodCreateRequest) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }

        const {
            published,
            unpublished,
            thumbnailId,
            extras,
            thumbnail,
            coverImageId,
            coverImage,
            isHaveExtras,
            deleteExtraDetailIds,
            deleteExtraIds,
            ...rest
        } = data

        const formatPublished = new Date(published).toISOString().slice(0, 10)
        const formatUnpublished = new Date(unpublished).toISOString().slice(0, 10)

        const payload = {
            ...rest,
            thumbnailId,
            coverImageId,
            published: formatPublished,
            unpublished: formatUnpublished,
            extras: isHaveExtras ? extras : [],
        }

        if (action === ACTIONS.create) {
            const value = await dispatch(createFood(payload as IFoodCreateRequest))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const hasUpdatedThumbnailId = typeof thumbnailId !== "string"
            const hasUpdatedCoverImageId = typeof coverImageId !== "string"

            const value = await dispatch(
                updateFood({
                    ...rest,
                    id,
                    deleteExtraDetailIds: deleteExtraDetailIds || [],
                    deleteMediaIds,
                    updateExtras: isHaveExtras ? extras : [],
                    deleteExtraIds: deleteExtraIds || [],
                    extras: [],
                    published: formatPublished,
                    unpublished: formatUnpublished,
                    ...(hasUpdatedThumbnailId && { thumbnailId }),
                    ...(hasUpdatedCoverImageId && { coverImageId }),
                } as IFoodUpdateRequest),
            )
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }

    useEffect(() => {
        if (initialValue) {
            const updatedExtras =
                initialValue.extras &&
                initialValue.extras.map(extra => {
                    if (extra.reqOpt) {
                        // If reqOpt is true, set Limit to 1
                        return { ...extra, Limit: 1 }
                    }
                    return extra
                })

            reset({
                ...initialValue,
                categoryId: initialValue.category?.id,
                thumbnailId: initialValue.thumbnail,
                coverImageId: initialValue.coverImage,
                isHaveExtras: initialValue.extras ? initialValue.extras.length >= 1 : false,
                deleteMediaIds: extractMediasObjects(initialValue.medias || []),
                mediaIds: [],
            })

            replaceExtra(updatedExtras)
        }
    }, [initialValue])

    useEffect(() => {
        if (!initialValue?.extras && isHaveExtras === true) {
            replaceExtra(initExtra)
        }
    }, [])

    useEffect(() => {
        const extras = getValues("extras")
        if (extras && extras.length > 0) {
            if (isHaveExtras === false || isHaveExtras === "false") {
                let extraIds = extras.map((extra: IExtra) => extra.id)
                extraIds = extraIds.filter((id: string) => id !== null && id !== undefined)
                setValue("deleteExtraIds", extraIds.length > 0 ? extraIds : [])
                replaceExtra([])
            }
        }
        if (extras.length === 0 && (isHaveExtras === true || isHaveExtras === "true")) {
            replaceExtra([initExtra])
        }
    }, [isHaveExtras])

    useEffect(() => {
        if (selectedBrand === "") {
            setValue("categoryId", "")
        }
    }, [selectedBrand])

    return (
        <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MultiLanguages control={control} fields={multiLangFields} />
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <SelectField
                                control={control}
                                name="categoryId"
                                defaultValue=""
                                options={categories.listItemOptions.filter((element: any) => {
                                    return element.belongToBrand
                                })}
                                label={t("common.category")}
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
                                name="isHaveExtras"
                                control={control}
                                label={t("food.isHaveExtras")}
                                options={[
                                    { label: t("common.true"), value: true },
                                    {
                                        label: t("common.false"),
                                        value: false,
                                    },
                                ]}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <DatePickerField
                                name="published"
                                label={t("common.published")}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DatePickerField
                                name="unpublished"
                                label={t("common.unpublished")}
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField
                                name="price"
                                label={t("common.price")}
                                type="text"
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField
                                name="discount"
                                label={t("common.originalPrice")}
                                control={control}
                                type="text"
                            />
                        </Grid>

                        <Grid item md={6} xs={12}>
                            <RadioGroupField
                                name="bestSeller"
                                control={control}
                                label={t("common.bestSeller")}
                                options={[
                                    { label: t("common.true"), value: true },
                                    {
                                        label: t("common.false"),
                                        value: false,
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <RadioGroupField
                                name="popular"
                                control={control}
                                label={t("food.popular")}
                                options={[
                                    { label: t("common.true"), value: true },
                                    {
                                        label: t("common.false"),
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
                                label={t("common.thumbnail")}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <UploadFileField
                                control={control}
                                name={`coverImageId`}
                                label={t("common.coverImage")}
                            />
                        </Grid>

                        <Grid item md={6} xs={12}>
                            <ul>
                                {fieldsMedias.map((item, index: number) => {
                                    return (
                                        <li key={item.id}>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    removeMedias(index)
                                                }}>
                                                Delete
                                            </Button>
                                            <UploadFileField
                                                control={control}
                                                name={`mediaIds.${index}`}
                                                label=""
                                            />
                                        </li>
                                    )
                                })}

                                <Button
                                    type="button"
                                    onClick={() => {
                                        appendMedias([1])
                                    }}>
                                    Add Images
                                </Button>
                            </ul>
                            <ul>
                                {fieldsUpdatedMedia.map((item: any, index: number) => {
                                    return (
                                        <li key={item.id}>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    handleRemoveCurrentFoodImages(item, index)
                                                }}>
                                                Delete
                                            </Button>
                                            <div>
                                                <CustomImage src={item.url} />
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={10 / 8}>
                        <Grid item xs={12}>
                            <Grid container spacing={2} borderTop={"1px solid #ccc"}>
                                <Grid item xs={12}>
                                    <h4>{t("food.extras.title")}</h4>
                                </Grid>
                            </Grid>
                            <FormProvider {...formMethods}>
                                {isHaveExtras &&
                                    extrasFields.map((extra, extraIndex) => {
                                        return (
                                            <ExtraFields
                                                key={`extras-${extra.id}`}
                                                id={extra.id}
                                                fields={extrasFields}
                                                extraIndex={extraIndex}
                                                remove={removeExtra}
                                            />
                                        )
                                    })}
                            </FormProvider>

                            {isHaveExtras && (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 4,
                                                marginBottom: "20px",
                                            }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => appendExtra(initExtra)}
                                                startIcon={<AddIcon />}>
                                                {t("food.extra")}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <FormActions
                isValid={Object.keys(errors).length === 0}
                backMainPage={() => backMainPage(pathname, action, router)}
                isSubmitting={isSubmitting}
            />
        </form>
    )
}

export default FoodForm
