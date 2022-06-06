##  二分搜索 🎃

> 一般有如下三个模板，模板3还能找到第一次后最后一次出现的位置

<img src="https://mynotes-1252832980.cos.ap-shanghai.myqcloud.com/image-20220406214027182.png" style="zoom:50%;" />

#### 1. 704. 二分查找

[链接](https://leetcode-cn.com/problems/binary-search/)

```go
func search(nums []int, target int) int {
    low, high := 0, len(nums) - 1
    for low <= high {
        mid := high + (low - high) >> 1
        num := nums[mid]
        if num == target {
            return mid
        }else if num > target {
            high = mid - 1
        } else {
            low = mid + 1
        }
    }
    return -1
}
```

#### 2. 35. 搜索插入位置

[链接](https://leetcode-cn.com/problems/search-insert-position/)

```go
func searchInsert(nums []int, target int) int {
    low, high := 0, len(nums) - 1
    for low <= high {
        mid := high + (low - high) >> 1
        num := nums[mid]
        if num == target {
            return mid
        }else if num > target {
            high = mid - 1
        }else {
            low = mid + 1
        }
    }
    return high + 1
}
```



#### 3. 32. 在排序数组中查找元素的第一个和最后一个位置

[链接](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

```go
func searchRange(nums []int, target int) []int {
    left := getLeft(nums, target)
    right := getRight(nums, target)
    
    if left == -2 || right == -2 {
        return []int {-1, -1}
    }
    if right - left > 1 {
        return []int {left + 1, right - 1}
    }
    return []int {-1, -1}
}

func getLeft(nums []int, target int) int {
    low, high := 0, len(nums) - 1
    border := -2
    for low <= high {
        mid := high + (low - high) >> 1
        if nums[mid] >= target {
            high = mid - 1
            border = high
        } else {
            low = mid + 1
        }
    }
    return border
}

func getRight(nums []int, target int) int {
    low, high := 0, len(nums) - 1
    border := -2
    for low <= high {
        mid := high + (low - high) >> 1
        if nums[mid] > target {
            high = mid - 1
        } else {
            low = mid + 1
            border = low
        }
    }
    return border
}
```

#### 4. 剑指offer53. 在排序数组中查找数字 I

[链接](https://leetcode-cn.com/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof/)

```go
func search(nums []int, target int) int {
    return bserach(nums, target) - bserach(nums, target - 1)
}

func bserach(nums []int, target int) int {
    low, high := 0, len(nums) - 1
    for low <= high {
        mid := high + (low - high) >> 1
        if nums[mid] > target {
            high = mid - 1
        } else {
            low = mid + 1
        }
    }
    return low
}
```

