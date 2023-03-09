import React from 'react';
import './App.css';
import { BinaryTree, BTNodeBase } from './tree';
import { TreeVis } from './TreeVis';
import { one_to_n } from './util';


function App() {
    const [colors, setColors] = React.useState(true);
    const [t, setT] = React.useState()
    const [t2, setT2] = React.useState()

    
    const getRandomTree = () => {
        let t = BinaryTree.randomFromInorder(one_to_n(15));
        t.annotatePositions();
        t.find(10).highlight = true;
        setT(t);
        let t2 = t.copy();
        t2.annotatePositions();
        setT2(t2);
        console.log(t.asList())
        console.log(t.asLayers())
    }

    React.useEffect(getRandomTree, [])

    const rotateLeft = () => {
        let x = t2.copy();
        x.rotLeft();
        x.annotatePositions();
        setT2(x);
    }

    const rotateRight = () => {
        let x = t2.copy();
        x.rotRight();
        x.annotatePositions();
        setT2(x);
    }

    return <div style={{
        margin: 10
    }}>
        <div style={{
            height: "max(80vh)",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
        }}>
            <TreeVis tree={t} colors={colors} />
            <TreeVis tree={t2} colors={colors} onNodeClick={(n, e) => {
                let val = n.val;
                let x = t2.copy();
                if (e.altKey) {
                    x.find(val).rotRight();
                } else {
                    x.find(val).rotLeft();
                }
                x.annotatePositions();
                setT2(x);
            }} />
        </div>
        <button onClick={() => setColors(!colors)}>
            Toggle colours
        </button>
        <button onClick={getRandomTree}>
            New tree
        </button>
        <button onClick={rotateLeft} disabled={!t2 || !t2.hasRightChild()}>
            Left
        </button>
        <button onClick={rotateRight} disabled={!t2 || !t2.hasLeftChild()}>
            Right
        </button>
    </div>
}

export default App;
