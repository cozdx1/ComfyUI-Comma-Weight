# ComfyUI Comma Weight

[English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

在 ComfyUI 的提示词输入框中按 `Ctrl+↑/↓`（macOS 使用 `Command+↑/↓`），即可调整整个以逗号分隔的标签的权重。即使光标位于标签中间，或只粗略选中了多个标签的部分文本，调整范围也会扩展到逗号边界。

这是一个不会在画布上添加节点的 ComfyUI 前端扩展。

## 工作方式

在 `black hair, long hair, smile` 中只选中 `hair, lo`，将 ComfyUI 的权重调整步长设为 `0.2`，然后按一次 `Ctrl+↑`：

```text
black h[air, lo]ng hair, smile
             ↓
(black hair, long hair:1.2), smile
```

下面分别比较了只选中单个标签的一部分，以及跨越两个标签选中部分文本时的效果。

| 选中范围 | ComfyUI 默认行为 | Comma Weight |
| --- | --- | --- |
| 单个标签的一部分 | ![只调整标签中选中文字的权重](image/single-default.png) | ![调整整个标签的权重](image/single-comma-weight.png) |
| 跨越两个标签的部分文本 | ![只调整选中文字片段的权重](image/group-default.png) | ![将两个完整标签作为一组调整](image/group-comma-weight.png) |

- 即使光标位于 `looking at viewer` 的中间，也会调整整个标签，使其变为 `(looking at viewer:1.2)`。
- 选中多个标签的部分文本时，会将范围扩展到两端的逗号边界，并作为一组调整。
- 对已有权重的分组再次使用快捷键时，会修改现有权重。权重回到 `1` 时，会移除外层的加权括号。
- 成对的 `()`、`[]` 或 `{}` 内的逗号不会被视为标签分隔符。换行会分隔标签。
- 调整步长遵循 ComfyUI 的 **Settings → Comfy → Edit Token Weight → Ctrl+up/down precision** 设置。

## 设置

在 **Settings → Comma-Weight → General** 中可以启用或禁用扩展。更改会立即生效。禁用后，`Ctrl+↑/↓` 会恢复为 ComfyUI 的默认行为。

![Comma-Weight 设置选项卡](image/settings-sidebar.png)

![Comma-Weight 启用设置](image/settings-toggle.png)

## 安装

### ComfyUI Manager

在 ComfyUI Manager 中搜索 **Comma Weight** 并安装，然后重启 ComfyUI 并刷新浏览器。

### 手动安装

在 ComfyUI 的 `custom_nodes` 目录中输入以下命令：

```sh
git clone https://github.com/cozdx1/ComfyUI-Comma-Weight.git
```

重启 ComfyUI 并刷新浏览器。更新手动安装的版本时，在克隆的目录中运行 `git pull`，然后再次重启并刷新浏览器。

## 兼容性

已在 ComfyUI 前端 `1.51.9` 上测试。快捷键适用于 ComfyUI 页面中可编辑的文本区域。使用其他前端版本，或安装了使用相同快捷键的扩展时，可能无法按预期工作。

## 开发

JavaScript 行为测试：`node --test tests/weight-range.test.mjs`

## 许可证

[MIT](LICENSE)
