"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ACTION_PATH } from "@/utils/constants"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import Form from "../../form"
import { getFact, selectFact } from "@/redux/features/fact/reducer"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { IFactRequest } from "@/types/fact"

const EditFact = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initValue = useAppSelector(selectFact)

    const fetchItem = async () => {
        await dispatch(getFact(id as string))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("fact.edit")} currentPathname={pathname} />
            <Form
                initValue={
                    {
                        name: initValue.name,
                        content: initValue.content,
                        type: initValue.type,
                        thumbnailId: initValue.thumbnail as number,
                        enabled: initValue.enabled,
                    } as IFactRequest
                }
                action={ACTION_PATH.edit}
                id={id as string}
            />
        </div>
    )
}

export default EditFact
