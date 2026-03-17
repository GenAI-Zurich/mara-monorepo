import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const schema = [
  { column: "id", type: "bigint", nullable: "No", default: "Auto-increment", description: "Primary key" },
  { column: "user_id", type: "uuid", nullable: "Yes", default: "—", description: "References auth.users.id. Null for anonymous sessions" },
  { column: "session_id", type: "text", nullable: "No", default: "—", description: "Browser session UUID (generated client-side)" },
  { column: "article_id", type: "bigint", nullable: "Yes", default: "—", description: "Product ID from articles.id. Null for search-level entries" },
  { column: "interaction_type", type: "text", nullable: "No", default: "—", description: "Event type (see below)" },
  { column: "search_query", type: "text", nullable: "Yes", default: "—", description: "User's search prompt" },
  { column: "carousel_position", type: "integer", nullable: "Yes", default: "—", description: "Position in carousel" },
  { column: "wishlist_name", type: "text", nullable: "Yes", default: "—", description: "Wishlist name" },
  { column: "project_name", type: "text", nullable: "Yes", default: "—", description: "Project/order list name" },
  { column: "quantity", type: "integer", nullable: "Yes", default: "—", description: "Number of units" },
  { column: "defect_description", type: "text", nullable: "Yes", default: "—", description: "Free-text defect report" },
  { column: "dwell_ms", type: "integer", nullable: "Yes", default: "—", description: "View duration in ms" },
  { column: "llm_reply", type: "text", nullable: "Yes", default: "—", description: "MARA LLM response (search only)" },
  { column: "returned_article_ids", type: "integer[]", nullable: "Yes", default: "{}", description: "Ordered article IDs from MARA" },
  { column: "mara_scores", type: "jsonb", nullable: "Yes", default: "[]", description: "{article_id, score, violations}" },
  { column: "constraint_suggestions", type: "jsonb", nullable: "Yes", default: "[]", description: "Extracted constraints from /extract" },
  { column: "previous_interactions_in_session", type: "integer", nullable: "Yes", default: "0", description: "Prior interaction count" },
  { column: "context", type: "jsonb", nullable: "Yes", default: "{}", description: "Open metadata field" },
  { column: "created_at", type: "timestamptz", nullable: "No", default: "now()", description: "Event timestamp" },
];

const events = [
  { type: "search", trigger: "User sends a chat message", fields: "search_query, llm_reply, returned_article_ids, mara_scores, constraint_suggestions" },
  { type: "product_view", trigger: "User opens a product card", fields: "article_id, search_query, carousel_position" },
  { type: "product_close", trigger: "User closes product detail", fields: "article_id, dwell_ms, search_query" },
  { type: "product_reject", trigger: "User clicks red ✕", fields: "article_id, search_query" },
  { type: "wishlist_add", trigger: "User adds to wishlist", fields: "article_id, wishlist_name, search_query" },
  { type: "wishlist_remove", trigger: "User removes from wishlist", fields: "article_id, wishlist_name, search_query" },
  { type: "project_add", trigger: "User adds to project", fields: "article_id, project_name, quantity, search_query" },
  { type: "project_submit", trigger: "User submits project order", fields: "article_id, project_name, quantity" },
  { type: "order_cancel", trigger: "User cancels order", fields: "article_id, project_name, quantity" },
  { type: "delivery_request", trigger: "User requests delivery", fields: "article_id, search_query" },
  { type: "defect_report", trigger: "User reports defect", fields: "article_id, defect_description" },
  { type: "constraint_accept", trigger: "User accepts filter", fields: "context.field, context.label, context.value" },
  { type: "constraint_reject", trigger: "User skips filter", fields: "context.field, context.label, context.value" },
];

const indexes = [
  { name: "idx_product_interactions_user", columns: "user_id" },
  { name: "idx_product_interactions_article", columns: "article_id" },
  { name: "idx_product_interactions_type", columns: "interaction_type" },
  { name: "idx_product_interactions_created", columns: "created_at" },
];

const policies = [
  { policy: "Users can insert own interactions", command: "INSERT", role: "authenticated", rule: "auth.uid() = user_id" },
  { policy: "Users can read own interactions", command: "SELECT", role: "authenticated", rule: "auth.uid() = user_id" },
  { policy: "Anon can insert interactions", command: "INSERT", role: "anon", rule: "user_id IS NULL" },
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold text-foreground mt-10 mb-4 border-b border-border pb-2">{children}</h2>
);

const SchemaDoc = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const lines = [
      "# product_interactions Schema\n",
      "## Columns\n",
      schema.map(s => `- ${s.column} (${s.type}, nullable: ${s.nullable}, default: ${s.default}) — ${s.description}`).join("\n"),
      "\n## Interaction Types\n",
      events.map(e => `- ${e.type}: ${e.trigger} → ${e.fields}`).join("\n"),
      "\n## RLS Policies\n",
      policies.map(p => `- ${p.policy} (${p.command}, ${p.role}): ${p.rule}`).join("\n"),
      "\n## Indexes\n",
      indexes.map(i => `- ${i.name}: ${i.columns}`).join("\n"),
    ].join("\n");
    const blob = new Blob([lines], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_interactions_schema.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-background text-foreground overflow-y-auto z-50">
      <div className="p-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/")} className="p-2 rounded-full hover:bg-secondary transition-colors"><ArrowLeft size={20} /></button>
        <h1 className="text-2xl font-bold flex-1">product_interactions — Schema Documentation</h1>
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-md bg-gold text-background font-medium hover:bg-gold/90 transition-colors">
          <Download size={16} /> Download .md
        </button>
      </div>

      <SectionTitle>Columns</SectionTitle>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-muted-foreground">
            <tr>{["Column","Type","Nullable","Default","Description"].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>{schema.map((s, i) => (
            <tr key={s.column} className={i % 2 === 0 ? "bg-card" : "bg-secondary/30"}>
              <td className="px-3 py-1.5 font-mono text-xs text-gold">{s.column}</td>
              <td className="px-3 py-1.5 font-mono text-xs">{s.type}</td>
              <td className="px-3 py-1.5">{s.nullable}</td>
              <td className="px-3 py-1.5 font-mono text-xs">{s.default}</td>
              <td className="px-3 py-1.5 text-muted-foreground">{s.description}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <SectionTitle>Interaction Types</SectionTitle>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-muted-foreground">
            <tr>{["Type","Trigger","Key Fields"].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>{events.map((e, i) => (
            <tr key={e.type} className={i % 2 === 0 ? "bg-card" : "bg-secondary/30"}>
              <td className="px-3 py-1.5 font-mono text-xs text-gold">{e.type}</td>
              <td className="px-3 py-1.5">{e.trigger}</td>
              <td className="px-3 py-1.5 font-mono text-xs text-muted-foreground">{e.fields}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <SectionTitle>RLS Policies</SectionTitle>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-muted-foreground">
            <tr>{["Policy","Command","Role","Rule"].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>{policies.map((p, i) => (
            <tr key={p.policy} className={i % 2 === 0 ? "bg-card" : "bg-secondary/30"}>
              <td className="px-3 py-1.5">{p.policy}</td>
              <td className="px-3 py-1.5 font-mono text-xs">{p.command}</td>
              <td className="px-3 py-1.5 font-mono text-xs">{p.role}</td>
              <td className="px-3 py-1.5 font-mono text-xs text-muted-foreground">{p.rule}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <SectionTitle>Indexes</SectionTitle>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-muted-foreground">
            <tr>{["Index","Column(s)"].map(h => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>{indexes.map((idx, i) => (
            <tr key={idx.name} className={i % 2 === 0 ? "bg-card" : "bg-secondary/30"}>
              <td className="px-3 py-1.5 font-mono text-xs">{idx.name}</td>
              <td className="px-3 py-1.5 font-mono text-xs text-gold">{idx.columns}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default SchemaDoc;
