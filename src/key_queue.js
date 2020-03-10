// Key queue, only useful for monosynth, currently useless since we're working with polysynths

class KeyNode {
    key;
    prev = null;
    next = null;;
    constructor(key, prev, next) {
      this.key = key;
      this.prev = prev;
      this.next = next;
    }
  };
  
  class KeyQueue {
  
    constructor() {
      this.key_set = new Map(); // set to hold keys
      this.tail = null;
    }
  
    get size() {
      return this.key_set.size;
    }
  
    // add key to the KeyQueue
    add(key) {
      this.remove(key);
      let obj = new KeyNode(key, this.tail, null);
      if (this.tail != null) {
        this.tail.next = obj;
      }
      this.key_set.set(key, obj);
      this.tail = obj;
    }
  
    // remove key from KeyQueue, returns tail afterwards if tail is what is removed
    remove(key) {
      let node = this.key_set.get(key);
      if (node != undefined) { //is the key exists in set, join prev to next when appropriate and delete
        if (node.prev != null) {
          node.prev.next = node.next;
        }
        if (node.next != null) {
          node.next.prev = node.prev;
        }
        this.key_set.delete(key);
      }
      if (node === this.tail) {
        this.tail = this.tail.prev;
        if (this.tail != null) {
          this.tail.next = null;
          return this.tail.key;
        }
      }
      return null;
    }
  }

  module.exports = KeyQueue;