import { isSorted, randomInt } from "./util";

export class BinaryTree {
    static fromPivotFunc(inorder = [], pivot) {
        // console.log(inorder);
        if (inorder.length === 0) return new BTNodeNull();
        const rootIdx = pivot(inorder);
        return new BTNode(
            inorder[rootIdx],
            this.fromPivotFunc(inorder.slice(0, rootIdx), pivot),
            this.fromPivotFunc(inorder.slice(rootIdx + 1), pivot)
        )

    }

    static balancedFromInorder(inorder) {
        return this.fromPivotFunc(inorder, i => Math.floor(i.length / 2));
    }


    static randomFromInorder(inorder) {
        // To ensure an okay-ish tree, choose a pivot in the middle half
        const pivot = i => { 
            if (i.length === 2) return randomInt(2);
            return randomInt(Math.floor(i.length / 2)) + Math.floor(i.length / 4);
        }
        return this.fromPivotFunc(inorder, pivot);
    }
}

// Abstract
export class BTNodeBase {
    constructor() {
        if (this.constructor === BTNodeBase) {
            throw new Error("BTNodeBase is abstract.");
        }
    }


}

class BTNode extends BTNodeBase {
    constructor(val, left = new BTNodeNull(), right = new BTNodeNull()) {
        super();
        this.val = val;
        this.left = left;
        this.right = right;
    }

    toString() {
        return `(${this.val} ${this.left.toString()} ${this.right.toString()})`;
    }

    inorder() {
        return [...this.left.indorder(), this.val, ...this.right.indorder()];
    }

    preorder() {
        return [this.val, ...this.left.preorder(), ...this.right.preorder()];
    }

    asList() {
        return [this, ...this.left.asList(), ...this.right.asList()]
    }

    isBST() {
        return isSorted(this.inorder());
    }

    rotRight() {
        let newRight = new BTNode(this.val, this.left.right, this.right);
        
        this.val = this.left.val;
        this.left = this.left.left;
        this.right = newRight;
    }

    rotLeft() {
        let newLeft = new BTNode(this.val, this.left, this.right.left);

        this.val = this.right.val;
        this.right = this.right.right;
        this.left = newLeft;
    }

    
    height() {
        return 1 + Math.max(this.left.height(), this.right.height());
    }

    find(key, bst = true) {
        if (key === this.val) return this;
        if (bst) {
            if (key < this.val) return this.left.find(key);
            if (key > this.val) return this.right.find(key);
        } else {
            let left = this.left.find(key);
            return left instanceof BTNodeNull
                ? this.right.find(key)
                : left;
        }
    }

    copy() {
        return new BTNode(
            this.val,
            this.left.copy(),
            this.right.copy()
        )
    }

    hasLeftChild() {
        return this.left instanceof BTNode;
    }

    hasRightChild() {
        return this.right instanceof BTNode;
    }

    isLeaf() {
        return (this.left instanceof BTNodeNull) && (this.right instanceof BTNodeNull);
    }

    // Must be called on root
    annotatePositions(depth = 0, offset = 0) {
        this.layer = depth;
        this.offset = offset;
        
        this.left.annotatePositions(depth + 1, this.offset);
        this.right.annotatePositions(depth + 1, this.offset + (this.hasLeftChild() ? this.left.width : 1));
        
        if (this.isLeaf()) this.width = 1;
        else if (this.hasLeftChild() && this.hasRightChild()) this.width = this.left.width + this.right.width;
        else this.width = 1 + this.left.width + this.right.width;
    }

    orNull() {
        return this;
    }

    asLayers() {
        let height = this.height();
        let layers = [[this]];

        for (let i = 0; i < height; i++) {
            layers.push([]);
            for (const node of layers[i]) {
                if (!node) {
                    layers[i + 1].push(null);
                    layers[i + 1].push(null);
                } else {
                    layers[i + 1].push(node.left.orNull());
                    layers[i + 1].push(node.right.orNull());
                }
            }
        }

        return layers
    }
}

class BTNodeNull extends BTNodeBase {
    constructor() {
        super();
        this.width = 0;
    }

    toString() {
        return '';
    }

    inorder() {
        return [];
    }

    preorder() {
        return [];
    }

    asList() {
        return []
    }

    isBST() {
        return true;
    }
    
    height() {
        return -1;
    }

    find() {
        return new BTNodeNull();
    }

    copy() {
        return new BTNodeNull();
    }

    annotatePositions() {
        // Nothing
    }

    orNull() {
        return null;
    }
}