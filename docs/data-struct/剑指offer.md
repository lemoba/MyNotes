## 《剑指offer》题解 🏅

> 《剑指Offer》第二版所有题目，共76道题目(未完待续)    题目来源：[leetcode](https://leetcode-cn.com/problemset/lcof/)
> 

### 😋[简单]

#### 1. 剑指 Offer 58 - II. 左旋转字符串

[链接](https://leetcode-cn.com/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof/)

```c
class Solution {
public:
    string reverseLeftWords(string s, int n) {
        reverse(s.begin(), s.begin());
        reverse(s.begin(), s.begin() + s.length() - n);
        reverse(s.begin() + s.length() - n, s.end());
        return s;
    }
};
```

#### 2. 剑指 Offer 27. 二叉树的镜像

[链接](https://leetcode-cn.com/problems/er-cha-shu-de-jing-xiang-lcof/)

* 递归

```c
class Solution {
public:
    TreeNode* mirrorTree(TreeNode* root) {
        if (!root) return NULL;      
        mirrorTree(root->left);
        mirrorTree(root->right);
        swap(root->left, root->right);
        return root;   
    }
};
```

* 栈模拟

```c
class Solution {
public:
    TreeNode* mirrorTree(TreeNode* root) {
        if (!root) return NULL;
        stack<TreeNode*> s;
        s.push(root);
        while (!s.empty()) {
            TreeNode* t = s.top();
            s.pop();
            if (t->left) s.push(t->left);
            if (t->right) s.push(t->right);
            swap(t->left, t->right);
        }
        return root;
    }
};
```

* 队列模拟

```c
class Solution {
public:
    TreeNode* mirrorTree(TreeNode* root) {
        if (!root) return NULL;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* t = q.front();
            q.pop();
            if (!t) continue;
            swap(t->left, t->right);
            if (t->left) q.push(t->left);
            if (t->right) q.push(t->right);
        }
        return root;
    }
};
```

#### 3. 剑指 Offer 55 - I. 二叉树的深度

[链接](https://leetcode-cn.com/problems/er-cha-shu-de-shen-du-lcof/)

* 递归

 ```c
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return NULL;
        int left = maxDepth(root->left);
        int right = maxDepth(root->right);
        return max(left, right) + 1;
    }
};
 ```

* 非递归

```c
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return NULL;
        queue<TreeNode*> q;
        q.push(root);
        int count = 0;
        while (!q.empty()) {
            int len = q.size();
            for (int i = 0; i < len; i++) {
                TreeNode * p = q.front();
                q.pop();
                if (p->left) q.push(p->left);
                if (p->right) q.push(p->right);
            }
            count++;           
        }
        return count;
    }
};
```

#### 4. 剑指 Offer 22. 链表中倒数第k个节点

> ​	快慢指针

[链接](https://leetcode-cn.com/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/) 

```c
class Solution {
public:
    ListNode* getKthFromEnd(ListNode* head, int k) {
        ListNode* fast = head;
        ListNode* slow = head;

        for (int i = 0; i < k; i++)
            fast = fast->next;

        while (fast && slow) {
            fast = fast->next;
            slow = slow->next;
        }    
        return slow;
    }
};
```

#### 5 . 剑指 Offer 17. 打印从1到最大的n位数

[链接](https://leetcode-cn.com/problems/da-yin-cong-1dao-zui-da-de-nwei-shu-lcof/)

```c
class Solution {
public:
    vector<int> printNumbers(int n) {
        vector<int> res;
        for (int i = 1; i < pow(10, n); i++) {
            res.push_back(i);
        }
        return res;
    }
};
```

#### 6. 剑指 Offer 05. 替换空格

[链接](https://leetcode-cn.com/problems/ti-huan-kong-ge-lcof/)

```c
class Solution {
public:
    string replaceSpace(string s) {
        int len = 0;
        for (auto x : s) {
            if (x == ' ') len += 3;
            else len++;
        }

        int i = s.size() - 1, j = len - 1;
        s.resize(len);

        while (i >= 0) {
            if (s[i] == ' ') {
                s[j--] = '0';
                s[j--] = '2';
                s[j--] = '%';
            }else s[j--] = s[i];
            i--;
        }

        return s;
    }
};
```

#### 7. 剑指 Offer 06. 从尾到头打印链表

[链接](https://leetcode-cn.com/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/)

```c
class Solution {
public:
    vector<int> reversePrint(ListNode* head) {
        vector<int> res;
        while (head) {
            res.push_back(head->val);
            head = head->next;
        }
        reverse(res.begin(), res.end());
        return res;
    }
};
```

* 利用栈

```c
class Solution {
public:
    vector<int> reversePrint(ListNode* head) {
        stack<int> s;
        while (head) {
            s.push(head->val);
            head = head->next;
        }
        vector<int> res;
        while (!s.empty()) {
            res.push_back(s.top());
            s.pop();
        }
        return res;          
    }
};
```

#### 8. 剑指 Offer 54. 二叉搜索树的第k大节点

[链接](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-di-kda-jie-dian-lcof/)

```c
class Solution {
public:
    int res = 0;
    int kthLargest(TreeNode* root, int k) {
        dfs(root, k);
        return res;
    }
    void dfs(TreeNode* root, int &k) {
        if (!root) return;
        dfs(root->right, k);
        k--;
        if (k == 0) res = root->val;
        dfs(root->left, k);
    }
};
```

#### 9. 剑指 Offer 24. 反转链表

[链接](https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/)

```c
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* cur = head;
        ListNode* pre = NULL;

        while (cur) {
            ListNode* next = cur->next;
            cur->next = pre;
            pre = cur;
            cur = next;
        }
        return pre;
    }
};
```

#### 10. 剑指 Offer 25. 合并两个排序的链表

[链接](https://leetcode-cn.com/problems/he-bing-liang-ge-pai-xu-de-lian-biao-lcof/)

```c
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        if (!l1) return l2;
        if (!l2) return l1;
        if (!l1 && !l2) return NULL;

        ListNode* dumyNode = new ListNode(0);
        ListNode* cur = dumyNode;

        while (l1 && l2) {
            if (l1->val < l2->val) {
                cur->next = l1;
                l1 = l1->next;
            }else {
                cur->next = l2;
                l2 = l2->next;
            }
            cur = cur->next;
        }
        cur->next = l1 != NULL ? l1 : l2;
        return dumyNode->next;
    }
};
```

#### 11. 剑指 Offer 15. 二进制中1的个数

[链接](https://leetcode-cn.com/problems/er-jin-zhi-zhong-1de-ge-shu-lcof/)

```c
class Solution {
public:
    int hammingWeight(uint32_t n) {
        int count =  0;
        while (n) {
            count++;
            n = n & (n - 1);
        }
        return count;
    }
};
```

#### 12. 剑指 Offer 09. 用两个栈实现队列

[链接](https://leetcode-cn.com/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/)

```c
class CQueue {
    stack<int> s1, s2;
public:
    CQueue() {

    }
    
    void appendTail(int value) {
        s1.push(value);
    }
    
    int deleteHead() {
        if (s2.empty()) {
            while (!s1.empty()) {
                s2.push(s1.top());
                s1.pop();
            }
        }
        if (s2.empty()) return -1;
        int del = s2.top();
        s2.pop();
        return del;
    }
};
```

#### 13. 剑指 Offer 57 - II. 和为s的连续正数序列

[链接](https://leetcode-cn.com/problems/he-wei-sde-lian-xu-zheng-shu-xu-lie-lcof/)

```c

```

#### 14. 剑指 Offer 68 - II. 二叉树的最近公共祖先

[链接](https://leetcode-cn.com/problems/er-cha-shu-de-zui-jin-gong-gong-zu-xian-lcof/)

```c
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root) return NULL;
        if (root == p || root == q) return root;

        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);

        if (left && right) return root;
        
        return left == NULL ? right : left;
    }
};
```

#### 15. 剑指 Offer 68 - I. 二叉搜索树的最近公共祖先

[链接](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-zui-jin-gong-gong-zu-xian-lcof/)

```c
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        TreeNode* res = root;
        while (1) {
            if (p->val < res->val && q->val < res->val)
                res = res->left;
            else if(p->val > res->val && q->val > res->val)
                res = res->right;
            else break;
        }   
        return res;
    }
};
```

#### 16. 剑指 Offer 32 - II. 从上到下打印二叉树 II

[链接](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-ii-lcof/)

```c
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> res;
        if (!root) return res;
        queue<TreeNode*> q;
        q.push(root);
        while (q.size()) {
            vector<int> ans;          
            int n = q.size();
            while (n--) {
                TreeNode* p = q.front();               
                ans.push_back(p->val);    
                q.pop();           
                if (p->left) q.push(p->left);
                if (p->right) q.push(p->right);
            }
            if (ans.size()) res.push_back(ans);
        }
        return res;
    }
};
```

#### 17. 剑指 Offer 39. 数组中出现次数超过一半的数字

[链接](https://leetcode-cn.com/problems/shu-zu-zhong-chu-xian-ci-shu-chao-guo-yi-ban-de-shu-zi-lcof/)

```c
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int count = 0;
        int cadidate = -1;
        for (auto x : nums) {
            if (x == cadidate) {
                count++;
            }else if (--count < 0) {
                cadidate = x;
                count = 1;
            }
        }
        return cadidate;
    }
};
```

#### 18. 剑指 Offer 03. 数组中重复的数字

[链接](https://leetcode-cn.com/problems/shu-zu-zhong-zhong-fu-de-shu-zi-lcof/)

```c
class Solution {
public:
    int findRepeatNumber(vector<int>& nums) {
        for (int i = 0; i < nums.size(); i++) {
            while (i != nums[i] && nums[nums[i]] != nums[i]) 
                swap(nums[i], nums[nums[i]]);

            if (i != nums[i] && nums[nums[i]] == nums[i])
                return nums[i];
        }  
        return -1;  
    }
};
```

#### 19. 不修改数组找出重复的数字            

[链接](https://www.acwing.com/problem/content/15/)

```c
class Solution {
public:
    int duplicateInArray(vector<int>& nums) {
        int l = 1, r = nums.size() - 1;
        while (l < r) {
            int mid = l + r >> 1;
            int s = 0;
            for (auto x: nums)  s += x >= l && x <= mid;
            if (s > mid - l + 1) r = mid;
            else l = mid + 1;
        }
        return l;
    }
};
```



#### 20. 剑指 Offer 57. 和为s的两个数字

[链接](https://leetcode-cn.com/problems/he-wei-sde-liang-ge-shu-zi-lcof/)

* hash表

```c
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_set<int> hash;
        for (auto x : nums) {
            if (hash.count(target - x)) return {target - x, x};
            else hash.insert(x);
        }
        return {};
    }
};
```

* 双指针

```c
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (nums[l] + nums[r] != target) {
            if (nums[l] + nums[r] > target) {
                r--;
                l = l == 0 ? 0 : l - 1;
            }else l++;
        }
        return {nums[l], nums[r]};
    }
};
```

#### 21. 剑指 Offer 21. 调整数组顺序使奇数位于偶数前面

[链接](https://leetcode-cn.com/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/)

```c
class Solution {
public:
    vector<int> exchange(vector<int>& nums) {
        int first = 0, last = nums.size() - 1;
        while (first <= last) {
            if (nums[first] % 2 != 0) {
                first++;
                continue;
            }
            if (nums[last] % 2 == 0) {
                last--;
                continue;
            }
            swap(nums[first++], nums[last--]);            
        }
        return nums;
    }  
};
```

#### 22. 剑指 Offer 62. 圆圈中最后剩下的数字

[链接](https://leetcode-cn.com/problems/yuan-quan-zhong-zui-hou-sheng-xia-de-shu-zi-lcof/)

* 递归

```c
class Solution {
public:
    int lastRemaining(int n, int m) {
        if (n == 1) return 0;
        return (lastRemaining(n - 1, m) + m) % n;
    }
};
```

* 模拟

```c

```

#### 23. 剑指 Offer 52. 两个链表的第一个公共节点

[链接](https://leetcode-cn.com/problems/liang-ge-lian-biao-de-di-yi-ge-gong-gong-jie-dian-lcof/)

```c
 if (headA == NULL && headB == NULL)
            return NULL;

        ListNode* A = headA;
        ListNode* B = headB;

        while (A != B) {
            A = A == NULL ? A = headB : A = A->next;
            B = B == NULL ? B = headA : B = B->next;         
        } 
        return A;   
```



#### 24. 剑指 Offer 50. 第一个只出现一次的字符

[链接](https://leetcode-cn.com/problems/di-yi-ge-zhi-chu-xian-yi-ci-de-zi-fu-lcof/)

```c
class Solution {
public:
    unordered_map<char, int> hash;
    char firstUniqChar(string s) {
        char res = ' ';       
        for (char c : s) hash[c]++;
        for (char c : s) {
            if (hash[c] == 1)
                return c;              
        }
        return res;
    }
};
```

#### 25. 剑指 Offer 42. 连续子数组的最大和

[链接](https://leetcode-cn.com/problems/lian-xu-zi-shu-zu-de-zui-da-he-lcof/)

```c
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int s = 0, res = INT_MIN;
        for (int x : nums) {
            if (s < 0) s = 0;
            s += x;
            res = max(res, s);
        }
        return res;
    }
};
```

#### 26. 剑指 Offer 18. 删除链表的节点

[链接](https://leetcode-cn.com/problems/shan-chu-lian-biao-de-jie-dian-lcof/)

```c
class Solution {
public:
    ListNode* deleteNode(ListNode* head, int val) {
        ListNode* dumyHead = new ListNode(0);
        dumyHead->next = head;
        ListNode* cur = dumyHead;
        
        while (cur->next) {
            if (cur->next->val == val) {
                ListNode* del = cur->next;
                cur->next = del->next;
            }else cur = cur->next;
        }
        return dumyHead->next;
    }
};
```

#### 27. 剑指 Offer 55 - II. 平衡二叉树

[链接](https://leetcode-cn.com/problems/ping-heng-er-cha-shu-lcof/)

```c
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    bool res = true;
    bool isBalanced(TreeNode* root) {
       dfs(root);
       return res; 
    }

    int dfs(TreeNode* root) {
        if (!root) return 0;
        int l = dfs(root->left);
        int r = dfs(root->right);

        if (abs(l - r) > 1) res = false;
        return max(l, r) + 1;
    }
};
```

#### 28. 剑指 Offer 28. 对称的二叉树

[链接](https://leetcode-cn.com/problems/dui-cheng-de-er-cha-shu-lcof/)

* 递归

```c
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        if (!root) return true;
        return compare(root->left, root->right);
    }
    bool compare(TreeNode* left, TreeNode* right) {
        if (!left && right) return false;
        else if(left && !right) return false;
        else if(!left && !right) return true;
        else if (left->val != right->val) return false;
        else return compare(left->left, right->right) && compare(left->right, right->left);
    }
};
```

* 非递归

```c
class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        if (!root) return true;
        queue<TreeNode*> q;
        q.push(root->left);
        q.push(root->right);
        while (q.size()) {
            TreeNode *left = q.front(); q.pop();
            TreeNode* right = q.front(); q.pop();

            if (!left && !right) continue;

            if (!left || !right || (left->val != right->val)) {
                return false;
            }

            q.push(left->left);
            q.push(right->right);
            q.push(left->right);
            q.push(right->left);
        }
        return true;
    }
};
```

#### 29. 剑指 Offer 30. 包含min函数的栈

[ 链接](https://leetcode-cn.com/problems/bao-han-minhan-shu-de-zhan-lcof/)

```c
class MinStack {
    stack<int> s, ss;
public:
    /** initialize your data structure here. */
    MinStack() {
        ss.push(INT_MAX);
    }
    
    void push(int x) {
        s.push(x);
        ss.push(std::min(ss.top(), x));
    }
    
    void pop() {
        s.pop();
        ss.pop();
    }
    
    int top() {
        return s.top();
    }
    
    int min() {
        return ss.top();
    }
};
```

#### 30. 剑指 Offer 65. 不用加减乘除做加法

[链接](https://leetcode-cn.com/problems/bu-yong-jia-jian-cheng-chu-zuo-jia-fa-lcof/)

```c
class Solution {
public:
    int add(int a, int b) {
        while (b) {
            int c = (unsigned int) (a&b) << 1;
            a ^= b;
            b = c;
        }
        return a;      
    }
};
```

#### 31. 剑指 Offer 40. 最小的k个数

[链接](https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/)

```c
class Solution {
public:
    vector<int> getLeastNumbers(vector<int>& arr, int k) {
        priority_queue<int> q;
        for (int x : arr) {
            q.push(x);
            if (q.size() > k) q.pop();
        }

        vector<int> res;
        while (q.size()) {
            res.push_back(q.top());
            q.pop();
        }

        return res;
    }
};
```

#### 32. 剑指 Offer 53 - I. 在排序数组中查找数字 I

[链接](https://leetcode-cn.com/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof/)

```c
class Solution {    
public:
    int bserach(vector<int>& nums, int n) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int mid = l + r >> 1;
            if (nums[mid] <= n) l = mid + 1;
            else r = mid - 1;         
        }
        return r;
    }
    int search(vector<int>& nums, int target) {
       return bserach(nums, target) - bserach(nums, target - 1);
    }
};
```

#### 33. 剑指 Offer 11. 旋转数组的最小数字

[链接](https://leetcode-cn.com/problems/xuan-zhuan-shu-zu-de-zui-xiao-shu-zi-lcof/)

```c
class Solution {
public:
    int minArray(vector<int>& nums) {
        if (!nums.size()) return 0;
        int l = 0, r = nums.size() - 1;
        while (l < r) {
            int mid = l + r >> 1;
            if (nums[mid] > nums[r]) l = mid + 1;
            else if (nums[mid] < nums[r]) r = mid;
            else r--;
        }
        return nums[l];
    }
};
```



#### 34. 剑指 Offer 61. 扑克牌中的顺子

[链接](https://leetcode-cn.com/problems/bu-ke-pai-zhong-de-shun-zi-lcof/)

```c
class Solution {
public:
    bool isStraight(vector<int>& nums) {
        if (!nums.size()) return false;
        sort(nums.begin(), nums.end());
        int k = 0;
        while (!nums[k]) k++;

        for (int i = k + 1; i < nums.size(); i++)
            if (nums[i] == nums[i - 1])
                return false;
        
        return nums.back() - nums[k] <= 4;
    }
};
```

#### 35. 剑指 Offer 29. 顺时针打印矩阵

[链接](https://leetcode-cn.com/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/)

```c

```

#### 36. 剑指 Offer 59 - I. 滑动窗口的最大值

[链接](https://leetcode-cn.com/problems/hua-dong-chuang-kou-de-zui-da-zhi-lcof/)

```c

```

#### 37. 剑指 Offer 53 - II. 0～n-1中缺失的数字

[链接](https://leetcode-cn.com/problems/que-shi-de-shu-zi-lcof/)

```c
class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int len = nums.size() - 1;
        int l = 0, r = len;
        while (l < r) {
            int mid = l + r >> 1;
            if (nums[mid] == mid) l = mid + 1;
            else r = mid;
        }
        return l == len && nums[l] == l ? l + 1 : l;
    }
};
```

#### 38. 剑指 Offer 58 - I. 翻转单词顺序

[链接](https://leetcode-cn.com/problems/fan-zhuan-dan-ci-shun-xu-lcof/)

```c
class Solution {
public:
    string reverseWords(string s) {
        stack<string> stk;
        string res,str;
        istringstream ss(s);
        while (ss >> str) stk.push(str), stk.push(" ");
        if (!stk.empty()) stk.pop();
        while (!stk.empty()) res += stk.top(), stk.pop();
        return res;
    }
};

```

#### 39. 剑指 Offer 10- II. 青蛙跳台阶问题

[链接](https://leetcode-cn.com/problems/qing-wa-tiao-tai-jie-wen-ti-lcof/)

```c
class Solution {
public:
    const int M = 1000000007;
    int f[110];
    int numWays(int n) {
        f[0] = 1;
        f[1] = 1;
        for (int i = 2; i <= n; i++)
            f[i] = (f[i - 1] % M + f[i - 2] % M) % M;
        return f[n];
    }
};
```

#### 40. 剑指 Offer 10- I. 斐波那契数列

[链接](https://leetcode-cn.com/problems/fei-bo-na-qi-shu-lie-lcof/)

```c
class Solution {
public:
    const int M = 1000000007;
    int fib(int n) {
        if (n < 2) return n;
        int a = 0, b = 1;
        int c;
        for (int i = 2; i <= n; i++) {
            c = (a + b) % M;
            a = b;
            b = c;
        }
        return c;
    }
};
```

### 😜[中等]

####  41.  剑指 Offer 64. 求1+2+…+n

[链接](https://leetcode-cn.com/problems/qiu-12n-lcof/)	

```c
class Solution {
public:
    int sumNums(int n) {
        int sum = n;
        n && (sum += sumNums(n - 1));
        return sum;
    }
};
```

#### 42. 剑指 Offer 56 - II. 数组中数字出现的次数 II

[链接](https://leetcode-cn.com/problems/shu-zu-zhong-shu-zi-chu-xian-de-ci-shu-ii-lcof/)

* 位运算

```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        one, two = 0, 0
        for num in nums:
            one = one ^ num & ~two
            two = two ^ num & ~one
        return one
```

* sort

```c
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        sort(nums.begin(), nums.end());

        for (int i = 0; i < nums.size() - 2; i += 3)
            if (nums[i] != nums[i + 2])
                return nums[i];

        return nums.back();
    }
};
```

#### 43. 剑指 Offer 35. 复杂链表的复制

[链接](https://leetcode-cn.com/problems/fu-za-lian-biao-de-fu-zhi-lcof/)

* O(n) O(n)

```c
class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return NULL;
        Node* cur = head;
        unordered_map<Node*, Node*> map;
        while(cur) {
            map[cur] = new Node(cur->val);
            cur = cur->next;
        }
        cur = head;
        while (cur) {
            map[cur]->next = map[cur->next];
            map[cur]->random = map[cur->random];
            cur = cur->next;
        }
        return map[head];
    }
};
```

* O(n) O(1)

```c

```



#### 44. 剑指 Offer 56 - I. 数组中数字出现的次数

[链接](https://leetcode-cn.com/problems/shu-zu-zhong-shu-zi-chu-xian-de-ci-shu-lcof/)

```c
class Solution {
public:
    vector<int> singleNumbers(vector<int>& nums) {
        int res = 0;
        for (auto x : nums) res ^= x;

        int k = 0;
        while (!(res >> k & 1)) k++;

        int a = 0, b = 0;
        for(auto x : nums) {
            if (x >> k & 1)
                a ^= x;
            else
                b ^= x;
        }
        return vector<int>{a, b};       
    }
};
```

#### 45. 剑指 Offer 07. 重建二叉树

[链接](https://leetcode-cn.com/problems/zhong-jian-er-cha-shu-lcof/) 

```c

```

#### 46. 剑指 Offer 47. 礼物的最大价值

[链接](https://leetcode-cn.com/problems/li-wu-de-zui-da-jie-zhi-lcof/)

```c

```

