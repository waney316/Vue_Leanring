        <el-tab-pane
          label="主机 - 群组管理"
          name="second"
        >
          <el-form
            :model="hostManagerForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="数据源选择"
              prop="dataSource"
            >
              <el-select
                v-model="dataSource"
                clearable
                placeholder="请选择Zabbix数据源"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in dataSourceOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="操作类型"
              prop="operationTypeOption"
            >
              <el-select
                v-model="operationType"
                clearable
                placeholder="请选择操作类型"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in operationTypeOption"
                  :key="item.name"
                  :label="item.alias"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="主机组选择"
              prop="name"
            >
              <el-input v-model="hostManagerForm.group"></el-input>
            </el-form-item>

            <el-form-item
              label="主机列表"
              prop="desc"
            >
              <el-input
                type="textarea"
                v-model="hostManagerForm.desc"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('hostManagerForm')"
              >立即创建</el-button>
              <el-button @click="resetForm('hostManagerForm')">重置</el-button>
            </el-form-item>

          </el-form>

        </el-tab-pane>
        <el-tab-pane
          label="主机 - 模板管理"
          name="third"
        >
          <el-form
            :model="hostManagerForm"
            :rules="rules"
            ref="hostManagerForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="数据源选择"
              prop="dataSource"
            >
              <el-select
                v-model="dataSource"
                clearable
                placeholder="请选择Zabbix数据源"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in dataSourceOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="操作类型"
              prop="operationTypeOption"
            >
              <el-select
                v-model="operationType"
                clearable
                placeholder="请选择操作类型"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in operationTypeOption"
                  :key="item.name"
                  :label="item.alias"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="模板选择"
              prop="name"
            >
              <el-input v-model="hostManagerForm.template"></el-input>
            </el-form-item>

            <el-form-item
              label="主机列表"
              prop="desc"
            >
              <el-input
                type="textarea"
                v-model="hostManagerForm.desc"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('hostManagerForm')"
              >立即创建</el-button>
              <el-button @click="resetForm('hostManagerForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="主机管理"
          name="four"
        >
          <el-form
            :model="hostManagerForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="数据源选择"
              prop="dataSource"
            >
              <el-select
                v-model="hostManagerForm.dataSource"
                clearable
                placeholder="请选择Zabbix数据源"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in dataSourceOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="主机列表"
              prop="desc"
            >
              <el-input
                type="textarea"
                v-model="hostManagerForm.desc"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="操作类型"
              prop="hostoperation"
            >
              <el-select
                v-model="hostoperation"
                clearable
                placeholder="请选择操作类型"
                style="margin-left: 10px"
              >
                <el-option
                  v-for="item in hostoperationOption"
                  :key="item.name"
                  :label="item.alias"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('hostManagerForm')"
              >立即创建</el-button>
              <el-button @click="resetForm('hostManagerForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="日志显示"
          name="five"
        >
          <log data="dasdadsa"></log>
        </el-tab-pane>