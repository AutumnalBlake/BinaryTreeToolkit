import { isSorted, randomInt } from "./util";

export class BinaryTree {
    static fromPivotFunc(inorder = [], pivot) {
        if (inorder.length === 0) return null;
        const rootIdx = pivot(inorder);
        return new BinaryTreeNode(
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
        return this.fromPivotFunc(inorder, pivot)
    }
}

export class BinaryTreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;

        // Positional information, invalidated upon modification
        this.layer = null;
        this.offset = null;
        this.width = null;
    }

    toString() {
        let l = this.left ? this.left.toString() : '';
        let r = this.right ? this.right.toString() : '';
        return `(${this.val} ${l} ${r})`;
    }

    inorder() {
        let l = this.left ? this.left.inorder() : [];
        let r = this.right ? this.right.inorder() : [];
        return [...l, this.val, ...r];
    }

    preorder() {
        let l = this.left ? this.left.preorder() : [];
        let r = this.right ? this.right.preorder() : [];
        return [this.val, ...l, ...r];
    }

    asList() {
        let l = this.left ? this.left.asList() : [];
        let r = this.right ? this.right.asList() : [];
        return [this, ...l, ...r];
    }

    isBST() {
        return isSorted(this.inorder());
    }

    find(key, bst = true) {
        if (key === this.val) return this;
        if (bst) {
            if (key < this.val) return this.left ? this.left.find(key) : null;
            if (key > this.val) return this.right ? this.right.find(key) : null;
        }
        return this.left ? this.left.find(key) : null || this.right ? this.right.find(key) : null;
    }

    // Must be called on root
    annotatePositions(depth = 0, offset = 0) {
        this.layer = depth;
        this.offset = offset;
        
        if (this.left) {
            this.left.annotatePositions(depth + 1, this.offset);
        }
        if (this.right) { 
            this.right.annotatePositions(depth + 1, this.offset + (this.left ? this.left.width : 1));
            // this.right.annotatePositions(depth + 1, this.offset + (this.left ? this.left.width : this.width / 2));
        }
        
        if (!this.left && !this.right) this.width = 1;
        else if (this.left && this.right) this.width = this.left.width + this.right.width;
        else if (this.left) this.width = 1 + this.left.width;
        else this.width = 1 + this.right.width;
    }

    height() {
        let l = this.left ? this.left.height() : -1;
        let r = this.right ? this.right.height() : -1;
        return 1 + Math.max(l, r);
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
                    layers[i + 1].push(node.left);
                    layers[i + 1].push(node.right);
                }
            }
        }

        return layers
    }
}