"use client"

import { getStoreDetail, selectStoreDetail } from "@/redux/features/store/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IDetailField } from "@/types/common"
import { ACTION_PATH, DETAIL_DATA_TYPE } from "@/utils/constants"
import { backMainPage } from "@/utils/helpers/common"
import { DetailContent, FormActions, PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const StoreDetail = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const item = useAppSelector(selectStoreDetail)
    const fields: IDetailField[] = [
        { key: "id", type: DETAIL_DATA_TYPE.TEXT, keyLabel: "common.id" },
        {
            key: "name",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.name",
        },
        {
            key: "address",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.address",
        },
        {
            key: "introduction",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.introduction",
        },
        {
            key: "time",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.time",
        },
        {
            key: "code",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.code",
        },
        {
            key: "latitude",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.latitude",
        },
        {
            key: "longitude",
            type: DETAIL_DATA_TYPE.TEXT,
            keyLabel: "common.longitude",
        },
        {
            key: "phone",
            type: DETAIL_DATA_TYPE.PHONE,
            keyLabel: "common.phone",
        },
        {
            key: "facebook",
            type: DETAIL_DATA_TYPE.LINK,
            keyLabel: "common.facebook",
        },
        {
            key: "brand.name",
            type: DETAIL_DATA_TYPE.MULTI_LANGUAGES,
            keyLabel: "common.brand",
        },
        {
            key: "thumbnail",
            type: DETAIL_DATA_TYPE.IMAGE,
            keyLabel: "common.thumbnail",
        },
        {
            key: "coverImage",
            type: DETAIL_DATA_TYPE.IMAGE,
            keyLabel: "common.coverImage",
        },
        {
            key: "enabled",
            type: DETAIL_DATA_TYPE.BOOLEAN,
            keyLabel: "common.enabled",
        },
    ]

    const fetchItem = async () => {
        await dispatch(getStoreDetail({ id: id as unknown as number }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("store.view")} currentPathname={pathname} />
            <DetailContent data={item} fields={fields} />
            <FormActions
                backMainPage={() => backMainPage(pathname, ACTION_PATH.view, router)}
                viewOnly={true}
            />
        </div>
    )
}

export default StoreDetail
