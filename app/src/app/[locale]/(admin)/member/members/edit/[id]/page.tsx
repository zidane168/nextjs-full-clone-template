"use client"

import { getDistricts, selectIsLoadDistrictList } from "@/redux/features/district/reducer"
import { getMember, selectMember } from "@/redux/features/member/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IMemberRequest } from "@/types/member"
import { ACTION_PATH } from "@/utils/constants"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import Form from "../../form"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const EditMember = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const isLoadDistrictList = useAppSelector(selectIsLoadDistrictList)
    const initValue = useAppSelector(selectMember)

    const fetchItem = async () => {
        await dispatch(getMember(id as string))
    }

    const fetchDistrict = async () => {
        if (!isLoadDistrictList) {
            await dispatch(getDistricts())
        }
    }

    useEffect(() => {
        fetchDistrict()
    }, [isLoadDistrictList])

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("member.edit")} currentPathname={pathname} />
            <Form initValue={initValue} action={ACTION_PATH.edit} id={id as string} />
        </div>
    )
}

export default EditMember
