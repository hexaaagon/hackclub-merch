import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function PicsumImage({
  id,
  sizes,
  fill = false,
  ...props
}: Readonly<
  {
    sizes: number | [number, number];
    id?: number;
    fill?: boolean;
  } & Omit<
    React.ComponentPropsWithRef<typeof Image>,
    "src" | "width" | "height" | "fill" | "sizes"
  >
>) {
  return (
    // ensure the badge is clipped to the image area and stays on top
    <div
      className="relative inline-block overflow-hidden rounded-lg"
      style={{
        maxWidth: `${Array.isArray(sizes) ? sizes[0] : sizes}px`,
        height: `${Array.isArray(sizes) ? sizes[1] : sizes}px`,
      }}
    >
      <Image
        src={
          id
            ? `https://picsum.photos/id/${id}/${Array.isArray(sizes) ? `${sizes[0]}/${sizes[1]}` : sizes}`
            : `https://picsum.photos/${Array.isArray(sizes) ? `${sizes[0]}/${sizes[1]}` : sizes}`
        }
        {...(fill
          ? { fill: true }
          : {
              width: Array.isArray(sizes) ? sizes[0] : sizes,
              height: Array.isArray(sizes) ? sizes[1] : sizes,
            })}
        {...props}
      />
      <Badge className="absolute right-2 bottom-2 z-10">
        Example image - Picsum
      </Badge>
    </div>
  );
}
