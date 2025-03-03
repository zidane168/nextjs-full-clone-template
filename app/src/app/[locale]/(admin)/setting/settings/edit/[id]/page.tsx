"use client"

import { getSettingDetail, selectSettingDetail } from "@/redux/features/setting/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ACTION_PATH } from "@/utils/constants"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import SettingForm from "../../form"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const EditSetting = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initValue = useAppSelector(selectSettingDetail)

    const fetchItem = async () => {
        await dispatch(getSettingDetail({ id: Number(id) }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading
                title={initValue ? "Edit " + initValue.name : t("setting.edit")}
                currentPathname={pathname}
            />
            <SettingForm initialValue={initValue} action={ACTION_PATH.edit} id={id as string} />
        </div>
    )
}

export default EditSetting
