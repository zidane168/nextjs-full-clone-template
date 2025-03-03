"use client"

import DatePickerField from "@/components/Form/DatePickerField"
import InputField from "@/components/Form/InputField"
import UploadFileField from "@/components/Form/UploadFileField"
import StoreTimeForm from "@/components/StoreTimeForm"
import { createStore, updateStore } from "@/redux/features/store/reducer"
import { useAppDispatch } from "@/redux/hooks"
import { IStore, IStoreCreateRequest, IStoreUpdateRequest } from "@/types/store"
import { ACTIONS, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import {
    backMainPage,
    checkFormIsDirtyAndNavigateBack,
    extractHolidayObjects,
    extractMediasObjects,
} from "@/utils/helpers/common"
import { useFetchBrand } from "@/utils/hooks/useFetchBrand"
import {
    FormActions,
    MultiLanguages,
    RadioGroupField,
    SelectField,
} from "@/views/DynamicComponent/DynamicComponent"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Grid } from "@mui/material"
import dayjs from "dayjs"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"

interface IStoreForm {
    id?: string
    initialValue?: IStore
    action: string
}

const StoreForm = (props: IStoreForm) => {
    const t = useTranslations()
    const { id, initialValue, action } = props
    const dispatch = useAppDispatch()
    const locale = useLocale()
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
            address: LanguageValidation,
            time: LanguageValidation,
            introduction: LanguageValidation,
            code: yup.string().optional(),
            phone: yup.string().required(requireMessage),
            facebook: yup.string().required(requireMessage),
            longitude: yup.number().required(requireMessage),
            latitude: yup.number().required(requireMessage),

            brandId: yup.number().required(requireMessage),
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
            times: yup.array(
                yup.object({ day: yup.number(), open: yup.string(), close: yup.string() }),
            ),
        })
        .required()

    const multiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
        {
            name: "address",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
        {
            name: "time",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
        {
            name: "introduction",
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
    })

    const INIT_TIME = {
        day: 1,
        open: "10:00 am",
        close: "10:00 pm",
    }
    const INIT_HOLIDAY = {
        day: "2024-05-05",
    }
    const {
        fields: fieldsTimes,
        append: appendTimes,
        remove: removeTimes,
    } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "times", // unique name for your Field Array
    })
    const {
        fields: fieldsHolidays,
        append: appendHolidays,
        remove: removeHolidays,
    } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "holidays", // unique name for your Field Array
    })

    const onSubmit = async (data: IStoreCreateRequest | IStoreUpdateRequest) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }

        const { thumbnailId, coverImageId, ...rest } = data

        if (action === ACTIONS.create) {
            const value = await dispatch(
                createStore({
                    ...data,
                    holidays: data?.holidays?.map(element => {
                        return {
                            day: dayjs(element?.day).format("YYYY-MM-DD"),
                        }
                    }),
                } as IStoreCreateRequest),
            )
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const hasUpdatedThumbnailId = typeof thumbnailId !== "string"
            const hasUpdatedCoverImageId = typeof coverImageId !== "string"

            const value = await dispatch(
                updateStore({
                    ...rest,
                    ...(hasUpdatedThumbnailId && { thumbnailId }),
                    ...(hasUpdatedCoverImageId && { coverImageId }),
                    id,
                    holidays: data?.holidays?.map(element => {
                        return {
                            day: dayjs(element?.day).format("YYYY-MM-DD"),
                        }
                    }),
                    times: data?.times?.map(element => {
                        let { initId, ...data } = element
                        return {
                            ...data,
                        }
                    }),
                } as IStoreUpdateRequest),
            )

            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }
    const brands = useFetchBrand(locale)

    useEffect(() => {
        reset({
            ...initialValue,
            thumbnailId: initialValue?.thumbnail,
            coverImageId: initialValue?.coverImage,
            brandId: initialValue?.brand?.id,
            times: extractMediasObjects(initialValue?.times || []),
            holidays: extractHolidayObjects(initialValue?.holidays || []),
        })
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
                                    name="brandId"
                                    control={control}
                                    label={t("common.brand")}
                                    options={brands.listItemOptions}
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
                        <MultiLanguages control={control} fields={multiLangFields} />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <InputField
                                    control={control}
                                    name="code"
                                    label={t("common.code")}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <InputField
                                    control={control}
                                    name="phone"
                                    label={t("common.phone")}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <InputField
                                    control={control}
                                    name="latitude"
                                    label={t("common.latitude")}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <InputField
                                    control={control}
                                    name="longitude"
                                    label={t("common.longitude")}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <InputField
                                    control={control}
                                    name="facebook"
                                    label={t("common.facebook")}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <UploadFileField
                                    name="coverImageId"
                                    control={control}
                                    label={t("common.coverImage")}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <UploadFileField
                                    name="thumbnailId"
                                    control={control}
                                    label={t("common.thumbnail")}
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <ul>
                                    {fieldsTimes.map((item: any, index) => {
                                        return (
                                            <li key={item.id}>
                                                <Button
                                                    color="error"
                                                    onClick={() => {
                                                        removeTimes(index)
                                                    }}>
                                                    Delete
                                                </Button>
                                                <StoreTimeForm
                                                    name="times"
                                                    control={control}
                                                    index={index}
                                                />
                                            </li>
                                        )
                                    })}

                                    <Button
                                        type="button"
                                        onClick={() => {
                                            appendTimes(INIT_TIME)
                                        }}>
                                        Add Store Times
                                    </Button>
                                </ul>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <ul>
                                    {fieldsHolidays.map((item: any, index) => {
                                        return (
                                            <li key={item.id}>
                                                <Button
                                                    color="error"
                                                    onClick={() => {
                                                        removeHolidays(index)
                                                    }}>
                                                    Delete
                                                </Button>
                                                <DatePickerField
                                                    format="YYYY-MM-DD"
                                                    control={control}
                                                    name={`holidays.${index}.day`}
                                                />
                                            </li>
                                        )
                                    })}

                                    <Button
                                        type="button"
                                        onClick={() => {
                                            appendHolidays(INIT_HOLIDAY)
                                        }}>
                                        Add Holiday Date
                                    </Button>
                                </ul>
                            </Grid>
                        </Grid>
                    </Box>
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

export default StoreForm
