import Image from "next/image"
import React from "react"
interface CustomImageProps {
    src: string
    width?: number
    height?: number
}
const CustomImage = ({ src, width = 150, height = 150 }: CustomImageProps) => {
    return <Image src={src} height={height} width={width} alt="Image" />
}

export default CustomImage
