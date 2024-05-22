import type { SizeKey } from "../../types/types";
import { type Component, useContext, createMemo, createSignal } from "solid-js";
import { bytes } from "@bundle/utils/utils/fmt.ts";
import { StaticContext, type NetworkNode } from "./index";
import { LABELS } from "../sizes";
import onMountWithCleaning from "../../utils/onMountWithCleaning";

export interface TooltipProps {
    node?: NetworkNode;
    sizeProperty: SizeKey;
    visible: boolean;
}

const Tooltip_marginX = 10;
const Tooltip_marginY = 30;

export const Tooltip: Component<TooltipProps> = ({ node, visible, sizeProperty }) => {
    const { availableSizeProperties, data } = useContext(StaticContext);

    let ref: HTMLDivElement = null;
    const [style, setStyle] = createSignal({});
    const content = createMemo(() => {
        if (!node) return null;

        return (
            <>
                <div>{node.id}</div>
                {availableSizeProperties.map((sizeProp) => {
                    if (sizeProp === sizeProperty) {
                        return (
                            <div>
                                <b>
                                    {LABELS[sizeProp]}: {bytes.format(node[sizeProp] ?? 0)}
                                </b>
                            </div>
                        );
                    } else {
                        return (
                          <div>
                            {LABELS[sizeProp]}:{" "}
                            {bytes.format(node[sizeProp] ?? 0)}
                          </div>
                        );
                    }
                })}
                {node.uid && (
                    <div>
                        <div>
                            <b>Imported By</b>:
                        </div>
                        {data.nodeMetas[node.uid].importedBy.map((params) => {
                            const { id } = data.nodeMetas[params.uid];
                            return <div>{id}</div>;
                        })}
                    </div>
                )}
            </>
        );
    });

    const updatePosition = (mouseCoords: { x: number; y: number }) => {
        if (!ref) return;

        const pos = {
            left: mouseCoords.x + Tooltip_marginX,
            top: mouseCoords.y + Tooltip_marginY,
        };

        const boundingRect = ref.getBoundingClientRect();

        if (pos.left + boundingRect.width > window.innerWidth) {
            // Shifting horizontally
            pos.left = window.innerWidth - boundingRect.width;
        }

        if (pos.top + boundingRect.height > window.innerHeight) {
            // Flipping vertically
            pos.top = mouseCoords.y - Tooltip_marginY - boundingRect.height;
        }

        setStyle(pos);
    };

    onMountWithCleaning(() => {
        const handleMouseMove = (event: MouseEvent) => {
            updatePosition({
                x: event.pageX,
                y: event.pageY,
            });
        };

        document.addEventListener("mousemove", handleMouseMove, true);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove, true);
        };
    });

    return (
        <div class={`tooltip ${visible ? "" : "tooltip-hidden"}`} ref={ref} style={style()}>
            {content()}
        </div>
    );
};
