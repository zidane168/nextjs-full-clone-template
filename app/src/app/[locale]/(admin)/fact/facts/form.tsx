import { createFact, updateFact } from "@/redux/features/fact/reducer"
import { getFactCategories } from "@/redux/features/factCategory/reducer"
import { useAppDispatch } from "@/redux/hooks"
import { IFactRequest, IFactUpdate } from "@/types/fact"
import { ACTIONS, FACT_TYPES, FACT_TYPE_OPTIONS, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import {
    FormActions,
    MultiLanguages,
    RadioGroupField,
    SelectField,
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

interface IFactForm {
    id?: string
    initValue: IFactRequest
    action: string
}

const Form = (props: IFactForm) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const { id, initValue, action } = props

    const requireMessage = t("validation.itemIsRequiredField")

    const ItemSchema = yup
        .object()
        .shape({
            name: yup
                .object()
                .shape({
                    tc: yup.string().required(requireMessage),
                    en: yup.string().required(requireMessage),
                    sc: yup.string().required(requireMessage),
                })
                .required(),
            content: yup
                .object()
                .shape({
                    tc: yup.string().required(requireMessage),
                    en: yup.string().required(requireMessage),
                    sc: yup.string().required(requireMessage),
                })
                .required(),
            type: yup.string().required(requireMessage),
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
        })
        .required()

    const fields = [
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
        watch,
        formState: { isSubmitting, isDirty },
    } = useForm({
        resolver: yupResolver<any>(ItemSchema),
        defaultValues: {
            enabled: true,
        },
    })

    const type = watch("type")

    const onSubmit = async (data: IFactRequest) => {
        const { name, content, thumbnailId, enabled, type } = data
        const createData = { name, content, thumbnailId, enabled, type }

        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }

        if (action === ACTIONS.create) {
            const value = await dispatch(createFact(createData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const updateData = { ...createData, id: Number(id) } as IFactUpdate
            const value = await dispatch(updateFact(updateData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }

    // const fetchFactCategories = async () => {
    //     await dispatch(getFactCategories())
    // }

    // useEffect(() => {
    //     if (!isLoadedList) fetchFactCategories()
    // }, [isLoadedList])

    useEffect(() => {
        reset(initValue)
    }, [initValue])

    return (
        <div>
            <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <SelectField
                            options={FACT_TYPE_OPTIONS}
                            control={control}
                            defaultValue={""}
                            name="type"
                            label={t("common.type")}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MultiLanguages control={control} fields={fields} />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    {type === FACT_TYPES.CONTACT_INFO && (
                        <Grid item xs={6}>
                            <UploadFileField
                                name="thumbnailId"
                                control={control}
                                label={t("common.thumbnail")}
                                canUploadVideo={false}
                            />
                        </Grid>
                    )}
                    <Grid item xs={6}>
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
                <Grid container spacing={2}></Grid>
                <FormActions
                    backMainPage={() => backMainPage(pathname, action, router)}
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    )
}

export default Form
