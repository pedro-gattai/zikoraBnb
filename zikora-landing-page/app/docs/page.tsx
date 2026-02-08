import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DocsLayout } from "@/components/docs/docs-layout"
import { DocsSection } from "@/components/docs/docs-section"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  GitBranch,
  ArrowLeftRight,
  TrendingUp,
  BarChart3,
  Info,
  Shield,
  Lock,
  Gauge,
  CheckCircle,
  Key,
  ArrowDown,
  Wallet,
  Droplets,
  MessageSquare,
} from "lucide-react"

export const metadata = {
  title: "Docs — Zikora",
  description:
    "Zikora documentation: architecture, AI agents, API reference, and more.",
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <DocsLayout>
        {/* ─── Hero ─── */}
        <div className="pb-8">
          <p className="font-mono text-xs font-normal uppercase tracking-[0.25em] text-muted-foreground">
            Documentation
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-foreground md:text-5xl">
            Zikora Docs
          </h1>
          <p className="mt-4 max-w-lg text-lg text-[#A8A4B8]">
            Everything you need to understand, integrate, and build on Zikora.
          </p>
        </div>

        {/* ─── 1. Introduction ─── */}
        <DocsSection id="introduction" title="Introduction">
          <p>
            <strong className="text-foreground">Zikora</strong> is a DeFAI
            (DeFi&nbsp;+&nbsp;AI) platform on BNB Chain. The name means{" "}
            <em>&ldquo;show the way&rdquo;</em> in Igbo (Nigeria).
          </p>
          <p>
            Connect your wallet and interact with specialized AI agents via
            natural language chat to swap tokens on PancakeSwap V3, earn yield
            on Venus Protocol, and track your portfolio &mdash; all without
            leaving the conversation.
          </p>

          {/* Testnet callout */}
          <div className="flex items-start gap-3 rounded-xl border border-[#FF6B2C]/30 bg-[#FF6B2C]/5 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#FF6B2C]" />
            <div>
              <p className="font-medium text-foreground">Testnet Only</p>
              <p className="text-sm">
                Zikora is currently deployed on BSC Testnet (chain&nbsp;ID
                97). Do not send real funds.
              </p>
            </div>
          </div>

          <ul className="space-y-2 pl-5 list-disc marker:text-[#FF6B2C]">
            <li>
              <strong className="text-foreground">Non-custodial</strong> &mdash;
              the backend never holds your private keys. You sign every
              transaction in MetaMask.
            </li>
            <li>
              <strong className="text-foreground">AI-powered</strong> &mdash;
              Claude Sonnet 4.5 classifies your intent and generates a
              transparent reasoning trace for every operation.
            </li>
            <li>
              <strong className="text-foreground">Transparent</strong> &mdash;
              every onchain operation returns a tx hash as proof. All agent
              reasoning is shown in the UI.
            </li>
          </ul>
        </DocsSection>

        {/* ─── 2. Quick Start ─── */}
        <DocsSection id="quickstart" title="Quick Start">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: Wallet,
                title: "Connect Wallet",
                text: "Open the Zikora app and connect MetaMask to BSC Testnet (chain ID 97).",
              },
              {
                step: "02",
                icon: Droplets,
                title: "Get Testnet BNB",
                text: (
                  <>
                    Visit the{" "}
                    <a
                      href="https://www.bnbchain.org/en/testnet-faucet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF6B2C] underline underline-offset-2"
                    >
                      BSC Testnet Faucet
                    </a>{" "}
                    to claim free testnet BNB.
                  </>
                ),
              },
              {
                step: "03",
                icon: MessageSquare,
                title: "Start Chatting",
                text: 'Type a command like "swap 10 USDT for BNB" and sign the transaction in MetaMask.',
              },
            ].map((s) => (
              <Card key={s.step} className="border-border bg-card">
                <CardHeader className="pb-3">
                  <span className="font-heading text-3xl font-extrabold text-[#FF6B2C]">
                    {s.step}
                  </span>
                  <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B2C]/10">
                    <s.icon className="h-5 w-5 text-[#FF6B2C]" />
                  </div>
                  <CardTitle className="mt-2 font-heading text-lg text-foreground">
                    {s.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#A8A4B8]">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DocsSection>

        {/* ─── 3. Architecture ─── */}
        <DocsSection id="architecture" title="Architecture">
          <p>
            Zikora follows a <strong className="text-foreground">non-custodial</strong>{" "}
            design: the backend prepares transaction calldata and the user signs
            every transaction in MetaMask. The backend never holds private keys.
          </p>

          {/* Flow diagram */}
          <div className="flex flex-col items-center gap-0">
            {[
              { label: "User Input", sub: "natural language" },
              { label: "RouterAgent", sub: "classifies intent via Claude AI" },
              {
                label: "Specialized Agent",
                sub: "prepares calldata + reasoning",
              },
              {
                label: "Frontend",
                sub: 'shows "Sign Transaction" card',
              },
              { label: "User signs in MetaMask", sub: "" },
              { label: "Transaction confirmed on BSC", sub: "" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex flex-col items-center">
                <div className="w-full max-w-xs rounded-xl border border-border bg-card px-5 py-3 text-center">
                  <p className="text-sm font-medium text-foreground">
                    {step.label}
                  </p>
                  {step.sub && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {step.sub}
                    </p>
                  )}
                </div>
                {i < arr.length - 1 && (
                  <ArrowDown className="my-2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Callout */}
          <div className="flex items-start gap-3 rounded-xl border border-[#FF6B2C]/30 bg-[#FF6B2C]/5 p-4">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[#FF6B2C]" />
            <p className="text-sm">
              <strong className="text-foreground">Backend is read-only</strong>{" "}
              &mdash; it reads onchain data and prepares calldata, but never
              holds private keys or submits transactions.
            </p>
          </div>
        </DocsSection>

        {/* ─── 4. AI Agents ─── */}
        <DocsSection id="agents" title="AI Agents">
          <p>
            Zikora uses a multi-agent architecture. The{" "}
            <strong className="text-foreground">RouterAgent</strong> classifies
            your intent and delegates to the right specialist.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: GitBranch,
                name: "RouterAgent",
                desc: "Classifies user intent via Claude AI and delegates to the appropriate specialist agent.",
                examples: [
                  "Any natural language input",
                ],
              },
              {
                icon: ArrowLeftRight,
                name: "TradingAgent",
                desc: "Executes token swaps via PancakeSwap V3 with route analysis and slippage optimization.",
                examples: [
                  '"swap 10 USDT for BNB"',
                  '"trade 0.5 BNB to USDC"',
                ],
              },
              {
                icon: TrendingUp,
                name: "YieldAgent",
                desc: "Manages lending positions on Venus Protocol — supply, redeem, and APY analysis.",
                examples: [
                  '"supply 100 USDT to Venus"',
                  '"check yield rates"',
                ],
              },
              {
                icon: BarChart3,
                name: "AnalyticsAgent",
                desc: "Provides portfolio tracking, PnL calculations, balance summaries, and recommendations.",
                examples: [
                  '"show my portfolio"',
                  '"what\'s my balance?"',
                ],
              },
            ].map((agent) => (
              <Card key={agent.name} className="border-border bg-card">
                <CardHeader className="pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B2C]/10">
                    <agent.icon className="h-5 w-5 text-[#FF6B2C]" />
                  </div>
                  <CardTitle className="mt-2 font-heading text-lg text-foreground">
                    {agent.name}
                  </CardTitle>
                  <CardDescription className="text-[#A8A4B8]">
                    {agent.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Example commands
                  </p>
                  <ul className="space-y-1">
                    {agent.examples.map((ex) => (
                      <li key={ex} className="text-sm font-mono text-foreground">
                        {ex}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </DocsSection>

        {/* ─── 5. Supported Tokens ─── */}
        <DocsSection id="tokens" title="Supported Tokens">
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Token</TableHead>
                  <TableHead className="text-muted-foreground">Symbol</TableHead>
                  <TableHead className="text-muted-foreground">Address</TableHead>
                  <TableHead className="text-muted-foreground text-right">Decimals</TableHead>
                  <TableHead className="text-muted-foreground">Venus vToken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    token: "BNB",
                    symbol: "BNB",
                    address: "Native",
                    decimals: 18,
                    vToken: "vBNB",
                  },
                  {
                    token: "Wrapped BNB",
                    symbol: "WBNB",
                    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
                    decimals: 18,
                    vToken: "—",
                  },
                  {
                    token: "Tether USD",
                    symbol: "USDT",
                    address: "0x55d398326f99059fF775485246999027B3197955",
                    decimals: 18,
                    vToken: "vUSDT",
                  },
                  {
                    token: "USD Coin",
                    symbol: "USDC",
                    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
                    decimals: 18,
                    vToken: "—",
                  },
                ].map((t) => (
                  <TableRow key={t.symbol} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      {t.token}
                    </TableCell>
                    <TableCell className="text-foreground">{t.symbol}</TableCell>
                    <TableCell className="font-mono text-xs text-[#A8A4B8] max-w-[180px] truncate">
                      {t.address}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      {t.decimals}
                    </TableCell>
                    <TableCell className="text-foreground">{t.vToken}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DocsSection>

        {/* ─── 6. Contract Addresses ─── */}
        <DocsSection id="contracts" title="Contract Addresses">
          <p className="font-medium text-foreground">PancakeSwap V3 (BSC Mainnet)</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Contract</TableHead>
                  <TableHead className="text-muted-foreground">Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: "Smart Router",
                    address: "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4",
                  },
                  {
                    name: "QuoterV2",
                    address: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
                  },
                  {
                    name: "Factory",
                    address: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
                  },
                ].map((c) => (
                  <TableRow key={c.name} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      {c.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[#A8A4B8] max-w-[260px] truncate">
                      {c.address}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator className="my-2" />

          <p className="font-medium text-foreground">Venus Protocol (BSC Mainnet)</p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Contract</TableHead>
                  <TableHead className="text-muted-foreground">Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: "Comptroller",
                    address: "0xfD36E2c2a6789Db23113685031d7F16329158384",
                  },
                  {
                    name: "vUSDT",
                    address: "0xfD5840Cd36d94D7229439859C0112a4185BC0255",
                  },
                  {
                    name: "vBNB",
                    address: "0xA07c5b74C9B40447a954e1466938b865b6BBea36",
                  },
                ].map((c) => (
                  <TableRow key={c.name} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      {c.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[#A8A4B8] max-w-[260px] truncate">
                      {c.address}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DocsSection>

        {/* ─── 7. API Reference ─── */}
        <DocsSection id="api" title="API Reference">
          <p>
            The Zikora backend exposes a REST API on port{" "}
            <code className="rounded bg-card px-1.5 py-0.5 font-mono text-sm text-foreground">
              3001
            </code>
            .
          </p>

          {/* POST /chat */}
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20">
                POST
              </Badge>
              <code className="font-mono text-sm text-foreground">/chat</code>
            </div>
            <p className="text-sm">
              Send a natural language message. The RouterAgent classifies intent
              and delegates to the appropriate agent.
            </p>
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Request body
              </p>
              <pre className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs text-foreground">
{`{
  "message": "swap 10 USDT for BNB",
  "walletAddress": "0x..."
}`}
              </pre>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Response
              </p>
              <pre className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs text-foreground">
{`{
  "reply": "Swapping 10 USDT → ~0.015 BNB...",
  "reasoning": "Chose 0.05% fee pool...",
  "txAction": {
    "to": "0x13f4EA83D0bd40E...",
    "data": "0x...",
    "value": "0"
  }
}`}
              </pre>
            </div>
          </div>

          {/* GET /portfolio */}
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/20">
                GET
              </Badge>
              <code className="font-mono text-sm text-foreground">
                /portfolio?walletAddress=0x...
              </code>
            </div>
            <p className="text-sm">
              Returns the user&apos;s portfolio: token balances, Venus
              positions, and total value.
            </p>
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Response
              </p>
              <pre className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs text-foreground">
{`{
  "totalValueUsd": 1847.23,
  "positions": [
    { "token": "BNB", "balance": "1.2", "valueUsd": 780.38 },
    { "token": "USDT (Venus)", "balance": "500", "valueUsd": 503.41 }
  ]
}`}
              </pre>
            </div>
          </div>

          {/* GET /transactions */}
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/20">
                GET
              </Badge>
              <code className="font-mono text-sm text-foreground">
                /transactions?walletAddress=0x...
              </code>
            </div>
            <p className="text-sm">
              Returns a list of past operations with agent reasoning and tx
              hashes.
            </p>
          </div>

          {/* POST /transactions */}
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/20">
                POST
              </Badge>
              <code className="font-mono text-sm text-foreground">
                /transactions
              </code>
            </div>
            <p className="text-sm">
              Frontend reports a confirmed transaction back to the backend for
              logging.
            </p>
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Request body
              </p>
              <pre className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs text-foreground">
{`{
  "walletAddress": "0x...",
  "txHash": "0xabc123...",
  "type": "swap",
  "details": { "tokenIn": "USDT", "tokenOut": "BNB", "amountIn": "10" }
}`}
              </pre>
            </div>
          </div>
        </DocsSection>

        {/* ─── 8. Security ─── */}
        <DocsSection id="security" title="Security">
          <p>
            Zikora is built with security as a first principle. The
            architecture is fully non-custodial.
          </p>

          <ul className="space-y-4">
            {[
              {
                icon: Shield,
                title: "Non-custodial",
                text: "The backend never holds private keys. All funds remain in your wallet at all times.",
              },
              {
                icon: Lock,
                title: "Calldata-only",
                text: "The backend prepares transaction calldata. You must review and sign every transaction in MetaMask.",
              },
              {
                icon: Gauge,
                title: "Slippage limit",
                text: "Maximum 1% slippage enforced by TradingAgent. Transactions revert if slippage exceeds the limit.",
              },
              {
                icon: CheckCircle,
                title: "Balance checks",
                text: "Every operation verifies your token balance before preparing calldata. No failed transactions from insufficient funds.",
              },
              {
                icon: Key,
                title: "Allowance checks",
                text: "If the token needs approval, the agent includes an approve step. If already approved, it skips it.",
              },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF6B2C]/10">
                  <item.icon className="h-4 w-4 text-[#FF6B2C]" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </DocsSection>

        {/* ─── 9. FAQ ─── */}
        <DocsSection id="faq" title="FAQ">
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Is Zikora custodial?",
                a: "No. Zikora is fully non-custodial. The backend prepares transaction calldata and the user signs every transaction in MetaMask. The backend never holds private keys or has access to your funds.",
              },
              {
                q: "Which networks are supported?",
                a: "Zikora currently supports BNB Smart Chain (BSC). During the hackathon, only BSC Testnet (chain ID 97) is active. Mainnet support is planned.",
              },
              {
                q: "What tokens can I trade?",
                a: "You can swap any pair of BNB, WBNB, USDT, and USDC via PancakeSwap V3. More tokens will be added post-hackathon.",
              },
              {
                q: "What can I earn yield on?",
                a: "You can supply USDT or BNB to Venus Protocol to earn lending yield. The YieldAgent will show you current APY rates and help you manage positions.",
              },
              {
                q: "Are there any fees?",
                a: "During the hackathon, Zikora charges zero platform fees. You only pay standard BSC gas fees (~$0.001 per tx) and PancakeSwap/Venus protocol fees.",
              },
              {
                q: "What is the max slippage?",
                a: "The TradingAgent enforces a maximum slippage of 1% on all swaps. Transactions will revert if the price moves more than 1% between quote and execution.",
              },
              {
                q: "How does the AI work?",
                a: "Zikora uses Claude Sonnet 4.5 (Anthropic) for intent classification and reasoning. The RouterAgent classifies your natural language input, delegates to a specialist agent, and the agent prepares the optimal transaction with a transparent reasoning trace.",
              },
            ].map((item, i) => (
              <AccordionItem
                key={`faq-${i}`}
                value={`faq-${i}`}
                className="border-border"
              >
                <AccordionTrigger className="text-foreground hover:text-[#FF6B2C] hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#A8A4B8]">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DocsSection>
      </DocsLayout>
      <Footer />
    </main>
  )
}
