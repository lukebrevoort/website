import type { KnowledgePack } from "./schema";

export const hftcPack: KnowledgePack = {
  slug: "hftc",
  title: "HFTC",
  summary:
    "A competition trading system for the Stevens High-Frequency Trading Competition, combining market-making discipline with momentum-based strategies on the SHIFT platform.",
  purpose:
    "Build a trading system that competes in the Stevens HFTC on the SHIFT platform by combining market-making discipline (continuous two-sided quotes) with momentum-based directional strategies, balancing stability and edge within a competition market.",
  intendedUser:
    "The competition entry team / evaluators at the Stevens High-Frequency Trading Competition, and as a portfolio artifact showing algorithmic-trading systems thinking.",
  architecture:
    "A Python trading bot built on Backtrader runs strategies against the SHIFT competition platform. Two complementary strategy families share a common risk and execution shell: a market-making strategy maintaining two-sided quotes with spread discipline, and a momentum strategy that takes directional positions on detected price moves. The shell handles order routing, position tracking, and risk limits so each strategy focuses on signal and sizing.",
  components: [
    { name: "Execution/risk shell", role: "Common layer handling order routing to SHIFT, position tracking, and risk limits shared by both strategies." },
    { name: "Market-making strategy", role: "Maintains two-sided quotes with spread discipline to capture the bid-ask spread while managing inventory." },
    { name: "Momentum strategy", role: "Takes directional positions when detected price moves meet momentum criteria." },
    { name: "Backtrader core", role: "Python framework backing the strategy definitions, backtests, and live execution." },
    { name: "SHIFT platform adapter", role: "Routes orders and market data to/from the competition exchange." },
  ],
  designDecisions: [
    { decision: "Pair market-making with momentum", rationale: "Market-making provides stability and persistent edge from the spread; momentum adds directional upside. Together they balance a competition portfolio rather than betting on one regime." },
    { decision: "Shared risk shell for both strategies", rationale: "Position limits and order discipline apply to both strategies; centralizing them avoids inconsistent risk behavior." },
    { decision: "Spread discipline over aggressive quoting", rationale: "In a competition market, avoiding adverse selection matters more than winning every fill; tight but disciplined quotes limit downside." },
    { decision: "Backtrader for strategies and backtest", rationale: "One framework across research/backtest and live execution keeps behavior consistent between simulation and the competition." },
  ],
  status: "Completed (June 2025). A finished competition entry.",
  limitations: [
    "Competition-specific: targeted at the SHIFT platform, not a production broker API.",
    "Competition market dynamics differ from real markets; results are not directly transferable to live trading.",
    "Backtest fidelity is bounded by Backtrader simulation; assumptions about fills and slippage simplify real microstructure.",
    "Not actively traded — it is a competition artifact, not a maintained strategy library.",
  ],
  technologies: ["Python", "Algorithm Development", "Backtrader", "Market Making", "Momentum Arbitrage"],
  links: [],
  visualVocabulary: [
    { token: "Primary green", usage: "Gains, momentum, upward moves", value: "#10b981" },
    { token: "Blue accent", usage: "Market-making, spreads, structure", value: "#3b82f6" },
    { token: "Dual-lane motif", usage: "Depict market-making and momentum as two parallel strategy lanes feeding one risk shell" },
    { token: "Bid-ask spread glyph", usage: "Represent the spread discipline of the market-maker" },
  ],
  diagramPatterns: [
    {
      name: "Dual-strategy lane",
      description: "Market-making and momentum run as two parallel strategy lanes that both feed the shared execution/risk shell.",
      nodes: ["Market-making strategy", "Momentum strategy", "Shared execution/risk shell", "SHIFT platform"],
      style: "Two lanes converging into a shared shell that routes to SHIFT. Green for momentum, blue for market-making.",
    },
    {
      name: "Two-sided quote spread",
      description: "Market-maker maintains bid and ask around a fair value with a disciplined spread.",
      nodes: ["Fair value", "Bid", "Ask", "Spread"],
      style: "Fair value at center, bid below and ask above, spread labeled between them.",
    },
    {
      name: "Momentum signal to position",
      description: "A detected momentum signal triggers a directional position subject to risk limits.",
      nodes: ["Price feed", "Momentum signal", "Position sizing", "Risk limit", "Directional order"],
      style: "Pipeline from price feed → signal → sizing (bounded by risk limit) → order.",
    },
  ],
  relationships: [],
  followUpQA: [
    { question: "Did it win the competition?", answer: "The system combined market-making with momentum in a balanced competition portfolio; the specific standing is a competition result. It is best read as a portfolio artifact showing coordinated strategy design." },
    { question: "Is this used for real trading?", answer: "No — it targeted the SHIFT competition platform, not a production broker. Competition dynamics differ from live markets." },
    { question: "Why pair the two strategies?", answer: "Market-making adds stability and edge from the spread; momentum adds directional upside. Together they avoid betting the whole entry on one market regime." },
    { question: "What framework is it built on?", answer: "Python with Backtrader, used for both backtests and live execution so behavior stays consistent." },
  ],
  brandColor: "#10b981",
  accentColor: "#3b82f6",
  lastAuthored: "2026-07-20",
};