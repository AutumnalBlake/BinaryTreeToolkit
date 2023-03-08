import './App.css';
import { BinaryTree } from './tree';
import { TreeVis } from './TreeVis';
import { one_to_n } from './util';


function App() {
    let t = BinaryTree.randomFromInorder(one_to_n(15));
    t.annotatePositions();
    t.find(7).highlight = true;
    let t2 = BinaryTree.balancedFromInorder(one_to_n(15));
    t2.annotatePositions();
    let t3 = BinaryTree.randomFromInorder("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    t3.annotatePositions();

    return <div style={{
        margin: 10
    }}>
        <TreeVis tree={t} />
        <TreeVis tree={t2} />
        <TreeVis tree={t3} />
        <br/>
        Height: {t.height()} <br/>
        Str: {t.toString()} <br/>
        Pre: {t.preorder()} <br/>
    </div>
}

export default App;
