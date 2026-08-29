## 2. MÃ GIẢ THIẾT KẾ HỆ THỐNG (PSEUDOCODE)

> Mã giả dưới đây mô tả logic xử lý theo đúng 5 tầng trong sơ đồ kiến trúc:
> Input → Parsing Layer → Core Generators (4 nhánh song song) → Test Assembler
> → Human Review Gate → Anti-Cheat Injector → Output.
> Trình bày dưới dạng pseudocode thuần (không ràng buộc cú pháp ngôn ngữ lập trình cụ thể).

---

### TẦNG 1 — INPUT

```
STRUCTURE Config:
    student_id
    base_url

INPUT: api_spec_document       // file đặc tả API (markdown/OpenAPI)
INPUT: config = Config(student_id, base_url)
```

---

### TẦNG 2 — PARSING LAYER (Spec Parser)

```
FUNCTION ParseSpecification(api_spec_document):
    endpoint_list = EMPTY LIST

    FOR EACH block IN SplitIntoEndpointBlocks(api_spec_document):
        endpoint = {
            method:            ExtractMethod(block),
            path:              ExtractPath(block),
            params:            ExtractQueryParams(block),
            body_schema:       ExtractRequestBodySchema(block),
            response_schema:   ExtractResponseSchema(block),
            requires_auth:     block CONTAINS "Authorization"
        }
        ADD endpoint TO endpoint_list

    RETURN endpoint_list
```

---

### TẦNG 3 — CORE GENERATORS (4 nhánh chạy song song trên mỗi endpoint)

**3.1 Domain / BVA Generator**
```
FUNCTION GenerateDomainBVATests(endpoint):
    test_cases = EMPTY LIST
    FOR EACH param IN endpoint.params:
        test_cases += PartitionCases(param)      // rỗng, hợp lệ, không tồn tại, sai kiểu
        test_cases += BoundaryCases(param)        // min, min-1, max, max+1
    TagTechnique(test_cases, "Domain")
    RETURN test_cases
```

**3.2 Dataflow / State Generator**
```
FUNCTION GenerateDataflowTests(endpoint, all_endpoints):
    // Cần biết endpoint nào liên quan đến endpoint nào
    // (vd: POST /categories liên quan GET /categories)
    related = FindRelatedEndpoints(endpoint, all_endpoints)
    test_cases = BuildStateChains(endpoint, related)
    // Ví dụ chain: CREATE -> VERIFY EXISTS -> DELETE -> VERIFY GONE
    TagTechnique(test_cases, "Dataflow")
    RETURN test_cases
```

**3.3 Security Generator**
```
CONSTANT PayloadLibrary = {
    SQLi:  ["' OR '1'='1", "admin'--", "'; DROP TABLE x;--", "' UNION SELECT 1,2,3--"],
    XSS:   ["<script>alert(1)</script>", "<img src=x onerror=alert(1)>"],
    IDOR:  ["swap_user_id_in_query", "spoof_x_user_id_header"],
    AuthBypass:          ["missing_token", "expired_token", "malformed_bearer"],
    PrivilegeEscalation: ["user_token_on_admin_route", "role_override_in_body"]
}

FUNCTION GenerateSecurityTests(endpoint):
    test_cases = EMPTY LIST

    IF endpoint.params IS NOT EMPTY OR endpoint.body_schema IS NOT EMPTY:
        test_cases += InjectionCases(endpoint, PayloadLibrary.SQLi)
        test_cases += InjectionCases(endpoint, PayloadLibrary.XSS)

    IF endpoint.requires_auth:
        test_cases += AuthCases(endpoint, PayloadLibrary.AuthBypass)
        test_cases += IDORCases(endpoint, PayloadLibrary.IDOR)

    IF IsAdminOnlyRoute(endpoint):
        test_cases += PrivilegeCases(endpoint, PayloadLibrary.PrivilegeEscalation)

    TagTechnique(test_cases, "Security")
    RETURN test_cases
    // Lưu ý thiết kế: payload luôn TRA CỨU từ PayloadLibrary,
    // không để hệ thống tự "sáng tác" chuỗi tấn công mới.
```

**3.4 Schema Validator Generator**
```
FUNCTION GenerateSchemaTests(endpoint):
    test_cases = EMPTY LIST
    FOR EACH (field_name, field_type) IN endpoint.response_schema:
        test_cases += TypeCheckCase(field_name, field_type)
    test_cases += ContentTypeHeaderCase()
    TagTechnique(test_cases, "Schema")
    RETURN test_cases
```

---

### TẦNG 4 — TEST ASSEMBLER

```
FUNCTION AssembleTestItem(endpoint, all_cases):
    item = {
        name:    endpoint.method + " " + endpoint.path,
        request: BuildRequestObject(endpoint),
        assertions: BuildAssertions(all_cases)
    }
    RETURN item

FUNCTION BuildAssertions(cases):
    // Assertion KHÁC NHAU tùy theo kỹ thuật — không dùng chung 1 mẫu cho mọi loại
    assertion_list = EMPTY LIST
    FOR EACH test_case IN cases:
        SWITCH test_case.technique:
            CASE "Domain":
                assertion_list += AssertStatusCode(test_case.expected_status)
            CASE "Security":
                assertion_list += AssertNoRawErrorLeaked()
                                 + AssertNoUnauthorizedDataExposed()
            CASE "Schema":
                assertion_list += AssertFieldType(test_case.field, test_case.expected_type)
            CASE "Dataflow":
                assertion_list += AssertStateReflectsPreviousAction(test_case.state_predicate)
    RETURN assertion_list
```

---

### TẦNG 5 — HUMAN REVIEW GATE

```
FUNCTION HumanReviewGate(collection_draft):
    ExportDraftAuditReport(collection_draft)     // xuất file .md nháp
    PRINT "Đang chờ người dùng gán nhãn VALID / INVALID / INCOMPLETE..."

    // Pipeline DỪNG LẠI tại đây, không tự động chạy tiếp
    reviewed_collection = WaitForHumanApproval(collection_draft)

    RETURN reviewed_collection
    // Chỉ những test case được người dùng approve mới đi tiếp sang tầng 6
```

---

### TẦNG 6 — ANTI-CHEAT INJECTOR

```
FUNCTION InjectAntiCheatHeader(reviewed_collection, config):
    prerequest_script = {
        trigger: "before every request",
        action:  SET header "X-Student-Id" = config.student_id
    }
    ATTACH prerequest_script TO reviewed_collection (Collection-level, không phải từng request lẻ)
    RETURN reviewed_collection
    // config.student_id lấy trực tiếp từ Config (Tầng 1),
    // KHÔNG đi qua Spec Parser — đảm bảo giá trị không bị làm sai lệch qua bước parse
```

---

### TẦNG 7 — OUTPUT

```
FUNCTION ExportResults(final_collection, config):
    WRITE final_collection TO "Collection.json"
    WRITE {baseUrl: config.base_url, student_id: config.student_id} TO "Environment.json"
    WRITE FormatAsAuditTable(final_collection) TO "Audit_Report.md"
```

---

### ORCHESTRATOR — điều phối toàn bộ pipeline

```
FUNCTION RunAgent(api_spec_document, config):
    endpoints = ParseSpecification(api_spec_document)              // Tầng 2
    collection_draft = EMPTY

    FOR EACH endpoint IN endpoints:
        all_cases = GenerateDomainBVATests(endpoint)                // Tầng 3.1
                  + GenerateDataflowTests(endpoint, endpoints)       // Tầng 3.2
                  + GenerateSecurityTests(endpoint)                  // Tầng 3.3
                  + GenerateSchemaTests(endpoint)                    // Tầng 3.4

        item = AssembleTestItem(endpoint, all_cases)                // Tầng 4
        ADD item TO collection_draft

    reviewed_collection = HumanReviewGate(collection_draft)         // Tầng 5
    final_collection = InjectAntiCheatHeader(reviewed_collection, config)  // Tầng 6
    ExportResults(final_collection, config)                         // Tầng 7

    PRINT "Hoàn tất: Collection.json, Environment.json, Audit_Report.md"


// Khởi chạy
config = Config(student_id: "23127443", base_url: "http://localhost:3000")
RunAgent(ReadFile("api_specification.md"), config)
```
