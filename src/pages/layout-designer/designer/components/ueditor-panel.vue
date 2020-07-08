<template>
    <div class="form-engine">
        <div class="form-engine-left">
            <slot name="leftSide"></slot>
        </div>
        <div class="form-engine-middle">
            <div class="engine-top">
                <div class="engine-top-options">
                    <slot name="options"></slot>
                </div>
                <div class="engine-top-operate">
                    <slot name="btns"></slot>
                </div>
            </div>
            <div class="engine-html" @click="$emit('preview-click', $event)">
               <slot name="preview"></slot>
            </div>
        </div>
        <div class="form-engine-right">
           <slot name="rightSide"></slot>
        </div>

        <slot name="other"></slot>
    </div>
</template>

<script>
export default {
}
</script>


<style lang="less">
@import '~@/static/css/sapi-variables.less';

.form-engine {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #404040;
    background-color:white;

    .form-engine-left,
    .form-engine-right,
    .form-engine-middle {
        float: left;
        height: 100%;
    }
    .form-engine-left {
        width: 220px;
        padding: 10px 10px 0 10px;
        padding-right: 5px;
        border-right: 1px solid #ccc;

        dt {
            padding-top: 10px;
            color: #333;
            font-weight: bold;
        }
        dd {
            padding-top: 10px;

            span {
                display: inline-block;
                width: 95px;
                height: 30px;
                margin-right: 5px;
                margin-bottom: 5px;
                text-align: center;
                line-height: 30px;
                background-color: #f4f6fc;
                border: 1px dotted #f4f6fc;
                border-radius: 2px;
                cursor: move;

                &:hover {
                    border: 1px dashed @--color-primary;
                }
                & > * {
                    cursor: move;
                }
                label {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }
            }

            .handler-event:hover {
                cursor: pointer;
                & > * {
                    cursor: pointer;
                }
            }

            span:nth-child(2n) {
                margin-right: 0px;
            }
        }

        .drag-layou {
            list-style: none;
            .title {
                padding-top: 10px;
                color: #333;
                font-weight: bold;
            }

            li:nth-child(n + 2) {
                margin-top: 10px;
                padding: 5px;
                margin-right: 5px;
                cursor: pointer;
                background-color: #f4f6fc;
                border: 1px solid #f4f6fc;
                border-radius: 2px;
                &:hover {
                    border: 1px solid @--color-primary;
                }
            }
        }
    }
    .form-engine-middle {
        position: relative;
        left: 0;
        top: 0;
        width: calc(100% - 422px);
        .engine-top {
            height: 45px;
            border-bottom: 1px solid #ccc;
            position: relative;
            z-index: 5;
            background: #fff;
        }

        .engine-top-set {
            float: left;
            margin-left: 10px;
            line-height: 45px;
        }

        .engine-top-operate {
            float: right;
            margin-right: 10px;
            line-height: 44px;
            & > .btn {
                display: inline-block;
                height: 30px;
                margin-right: 10px;
                padding: 0 26px;
                font-size: 14px;
                cursor: pointer;
                line-height: 30px;
                text-align: center;
                vertical-align: middle;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border: 1px solid transparent;
                border-radius: 2px;
                transition: all;
                transition-duration: 0.3s;

                &.border-green {
                    border-color: #0db3a6;
                    color: #0db3a6;

                    &:hover {
                        background: #0db3a6;
                        color: #fff;
                    }
                }
                &.green {
                    color: #fff;
                    background-color: #0db3a6;
                    border-color: #0db3a6;
                    &:hover {
                        background-color: #0a8d83;
                        border-color: #0a8d83;
                    }
                }
            }
        }

        .engine-top-options {
            float:left;
            margin-left:10px;
            line-height:44px;
        }

        .engine-html {
            width: 100%;
            height: calc(100% - 45px);
            padding: 10px;
            padding-bottom: 30px;
            overflow-y: auto;

            .row {
                display: flex;
                height: 52px;
                margin-bottom: 10px;
                justify-content: space-between;
                clear: both;

                .column {
                    display: flex;
                    width: calc(50% - 10px);
                    height: 100%;
                    padding-right: 5px;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                    align-items: center;
                    cursor: move;

                    &.add {
                        height: 50px;
                        background: #ebf8fb;
                    }

                    &.active {
                        background: #ebf8fb;
                    }

                    &:hover {
                        background: #f3fdfc;
                    }
                }
                &.table {
                    min-height: 80px;
                    table {
                        border-collapse: collapse;
                        border-spacing: 0;
                    }

                    tr {
                        border-collapse: collapse;
                        border-spacing: 0;
                    }
                    th {
                        text-align: left;
                    }

                    td {
                        cursor: pointer;
                        input {
                            cursor: pointer;
                        }

                        &.active {
                            background: #86ddd6;
                        }
                    }

                    th,
                    td {
                        padding: 5px;
                        border: 1px solid #ccc;
                    }
                    .column {
                        height: 80px;
                        align-items: flex-start;
                        flex-wrap: wrap;
                    }

                    .table-container {
                        height: 100%;
                        td input {
                            width: 80px;
                        }
                    }
                }

                .full-col {
                    width: 100%;
                }

                .space-container {
                    width: 100%;
                    line-height: 40px;
                }
            }

            .label-width {
                display: inline-block;
                width: 105px;
                height: 100%;
                padding-right: 5px;
                padding-left: 5px;

                vertical-align: middle;;
                line-height: 50px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .active .label-width {
                border-left: 5px solid #0db3a6;
            }
            .auto-adjust {
                flex-grow: 1;
                display: flex;
                max-width: calc(100% - 106px);
                height: 40px;
                align-items: center;

                input {
                    width: 150px;
                    height: 28px;
                }

                &.table {
                    border: 1px solid #eee;
                }

                &.space-oprate {
                    height: calc(100% - 2px);
                    min-width: 100px;
                    flex-grow: 0;
                    padding: 0 15px 0 2px;
                    border: 1px solid #eee;
                    background: #fff;
                }
            }

            .engine-tab {
                li {
                    display: inline-block;
                    margin-right: 10px;
                    padding: 2px 15px;
                    cursor: pointer;
                    background-color: #eee;

                    &.active,
                    &:hover {
                        background: transparent;
                        color: @--color-primary;
                    }
                }
                & + div {
                    margin-top: 10px;
                }
            }

            .space-label {
                display: inline-block;
                height: 30px;
                margin: 0 5px;
                padding: 0px 10px;
                line-height: 30px;
                cursor: pointer;
                background: #f1f1f1;
                border-radius: 2px;
                border: 1px solid transparent;
                &.active {
                    border-width: 2px;
                    border-color: #0db3a6;
                }
            }

            .list-row,
            .filter-row, .operate-row{
                min-height: 80px;
                height: auto;
                .column > .auto-adjust {
                    height: 100%;
                }
            }

            .list-row {
                .column > .auto-adjust {
                    width: calc(100% - 105px);
                    overflow-y: hidden;
                    overflow-x: auto;
                }
            }

            .filter-row, .operate-row{
                .column {
                    cursor: default;
                }
                .filter-container {
                    flex-wrap: wrap;
                    padding-top: 5px;
                    align-items: flex-start;

                    .item {
                        margin-right: 20px;
                        margin-bottom: 5px;
                        padding: 2px;
                        border: 2px solid #eee;
                        overflow: hidden;
                        &.active {
                            border-color: #0db3a6;
                        }
                        cursor: move;
                        & > span {
                            display: inline-block;
                            min-width: 85px;
                        }

                        input {
                            width: 80px;
                            margin-left: 2px;
                            cursor: move;
                        }
                    }
                }
            }
            .operate-row{
                .filter-container {
                    .item {
                        padding: 2px 6px;
                        text-align: center;
                        & > span {
                            min-width: 30px;
                        }

                        input {
                            display: none;
                        }
                    }
                }
            }
        }
    }
    .form-engine-right {
        flex-grow: 0;
        width: 200px;
        border-left: 1px solid #ccc;
        overflow-y: auto;

        .fullline {
            width: 100%;
        }
    }

    dl,
    dd,
    dt,
    ul,
    li {
        margin: 0;
        padding: 0;
    }
    ul {
        list-style: none;
    }

    .drag-option {
        padding: 10px 5px;
        .item {
            margin-bottom: 10px;

            &.inline-block {
                & > * {
                    display: inline-block;
                }
                .title {
                    padding-right: 5px;
                }
            }
        }
        .title {
            font-weight: bold;
            line-height: 28px;
        }
        .value {
            line-height: 28px;
            & + .title {
                padding-left: 5px;
                font-weight: normal;
                color: #666;
            }
        }
    }
}

.engine-script {
    textarea {
        display: block;
        resize: vertical;
        padding: 5px 15px;
        line-height: 1.5;
        box-sizing: border-box;
        width: 100%;
        font-size: 14px;
        font-family: Menlo, Monaco, Consolas, Courier, monospace;
        color: #606266;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        outline: none;
    }

    .item {
        display: flex;
        width: 100%;
        margin-bottom: 10px;

        & > .title {
            width: 65px;
        }

        & > .value {
            flex-grow: 1;
        }
    }
}

.engine-delete-btn {
    position: fixed;
    left: 0;
    top: 0;
    width: 40px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border: 1px solid #eee;
    & > i:hover {
        cursor: pointer;
        background: #d7f7f7;
    }

    & > i {
        font-size: 16px;
    }
    &.hide {
        display: none;
    }
}

.engine-copy-drag {
    position: fixed;
    left: 0;
    top: 0;
    border: 1px solid #eee;
    background-color: #ebf8fb;
}

.engine-preview {
    .main-filter {
        padding-top: 20px;
    }
}
</style>

