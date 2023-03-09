import React, { Fragment } from "react";
import { ping_pong, randomInt } from "./util";

const LAYER_HEIGHT = 50
const BASE_WIDTH = 50
const NODE_RADIUS = 20
const HIGHLIGHT_COLOUR = "#DDD"
const COLORS = [
    "#264653",
    "#2a9d8f",
    "#e9c46a",
    "#f4a261",
    "#e76f51",
]

export function TreeVis({ tree, colors = true, onNodeClick = (n, e) => console.log([n, e]) }) {
    if (!tree) return <>
        <svg>
            <text
                textAnchor={"middle"}
                dominantBaseline={"central"}
                fontWeight={"bold"}
                fontSize={"1.2em"}
                x="50%"
                y="50%"
            >
                [EMPTY]
            </text>
        </svg>
    </>

    let num_layers = tree.height() + 1;

    return <>
        <svg
            width={BASE_WIDTH * tree.width + 2}
            height={num_layers * LAYER_HEIGHT + 2}
        >
            {tree.asList().map((node, i) => node && <Fragment key={i}>
                {node.hasLeftChild() && <Connector from={node} to={node.left} />}
                {node.hasRightChild() && <Connector from={node} to={node.right} />}
            </Fragment>)}
            {tree.asList().map((node, i) => node &&
                <TreeNode node={node} key={i} color={colors} onClick={onNodeClick} />
            )}
        </svg>
    </>;
}

function nodePos(node) {
    if (isNaN(node.offset)) {
        console.log("NaN offset!");
        console.log(node);
    }
    // [x, y]
    return [
        node.offset * BASE_WIDTH + node.width / 2 * BASE_WIDTH,
        node.layer * LAYER_HEIGHT + LAYER_HEIGHT / 2
    ]
}

function Connector({ from, to }) {
    let [fx, fy] = nodePos(from);
    let [tx, ty] = nodePos(to);

    return <line
        x1={fx} x2={tx}
        y1={fy} y2={ty}
        stroke={"Black"}
    />
}

function TreeNode({ node, showBounds = false, color = true, onClick }) {
    const [hover, setHover] = React.useState(false);

    let [x, y] = nodePos(node);

    return <g>
        {showBounds && <rect
            width={node.width * BASE_WIDTH}
            height={LAYER_HEIGHT}
            x={node.offset * BASE_WIDTH}
            y={node.layer * LAYER_HEIGHT}
            fill={"None"}
            stroke="Black"
        />}
        <circle
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={e => onClick(node, e)}
            filter={color ? "none" : "drop-shadow(2px 2px 3px rgb(0 0 0 / 0.2))"}
            r={NODE_RADIUS * (hover ? 1.1 : 1)}
            // fill={node.highlight ? HIGHLIGHT_COLOUR : "White"}
            fill={color ? COLORS[ping_pong(node.layer, COLORS.length - 1)] : "White"}
            stroke={color ? "None" : "Black"}
            cx={x}
            cy={y}
        />
        <text
            x={x}
            y={y}
            pointerEvents={"none"}
            textAnchor={"middle"}
            dominantBaseline={"central"}
            fontWeight={"bold"}
            fontSize={"1.2rem"}
            fill={color ? "#FFF" : "#000" }
        >
            {node.val}
        </text>
    </g>
}