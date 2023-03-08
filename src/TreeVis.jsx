import React, { Fragment } from "react";

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

export function TreeVis({ tree }) {
    let num_layers = tree.height() + 1;

    return <>
        <svg
            width={BASE_WIDTH * tree.width + 2}
            height={num_layers * LAYER_HEIGHT + 2}
        >
            {tree.asList().map((node, i) => node && <Fragment key={i}>
                {node.left && <Connector from={node} to={node.left} />}
                {node.right && <Connector from={node} to={node.right} />}
            </Fragment>)}
            {tree.asList().map((node, i) => node &&
                <TreeNode node={node} key={i} />
            )}
        </svg>
    </>;
}

function nodePos(node) {
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

function TreeNode({ node, showBounds = false, showCircle = true}) {
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
        {showCircle && <circle
            r={NODE_RADIUS}
            // fill={node.highlight ? HIGHLIGHT_COLOUR : "White"}
            fill={COLORS[Math.min(node.layer, 4)]}
            // stroke={"Black"}
            cx={x}
            cy={y}
        />}
        <text
            x={x}
            y={y}
            textAnchor={"middle"}
            dominantBaseline={"central"}
            fontWeight={"bold"}
            fontSize={"1.2em"}
            fill="#FFF"
        >
            {node.val}
        </text>
    </g>
}