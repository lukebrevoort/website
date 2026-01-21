'use client'

import { useState } from 'react'
import {
  ProjectPageShell,
  ProjectHero,
  ProjectSection,
  ProjectMedia,
  ProjectBulletList,
  ProjectTagList,
  ProjectStatGrid,
} from '@/components/project-detail'
import { getProjectBySlug } from '@/data/projects'

export default function HFTCPage() {
  const [activeItem, setActiveItem] = useState('#overview')
  const project = getProjectBySlug('hftc')

  if (!project) {
    return <div>Project not found</div>
  }

  const navigation = [
    { name: 'Overview', href: '#overview' },
    { name: 'Strategies', href: '#strategies' },
    { name: 'Stack', href: '#stack' },
    { name: 'Competition', href: '#competition' },
    { name: 'Impact', href: '#impact' },
  ]

  return (
    <ProjectPageShell
      project={project}
      navigation={navigation}
      activeItem={activeItem}
      onItemClick={setActiveItem}
    >
      <ProjectHero
        eyebrow="Algorithmic trading"
        title="HFTC System"
        description="A dual-strategy trading engine built for the Stevens High-Frequency Trading Competition, combining market-making discipline with momentum-based entries."
        accentColor={project.primaryColor}
        actions={[
          {
            label: 'Competition recap',
            href: 'https://fsc.stevens.edu/2025-high-frequency-trading-competition-recap/',
          },
        ]}
      />

      <ProjectSection
        id="overview"
        eyebrow="Overview"
        title="Built for live trading constraints"
        subtitle="A system tuned for speed, risk control, and noisy market conditions."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-sm text-slate-600 sm:text-base">
            <p>
              The strategy stack is designed for fast decision cycles and controlled exposure. Data ingestion,
              order management, and risk checks run with minimal latency on the SHIFT platform.
            </p>
            <p>
              The final system competed against 22 teams across multiple simulated market regimes.
            </p>
          </div>
          {project.image && (
            <ProjectMedia src={project.image} alt="HFTC trading system" />
          )}
        </div>
      </ProjectSection>

      <ProjectSection
        id="strategies"
        eyebrow="Strategies"
        title="Two complementary approaches"
        subtitle="Market making stabilizes inventory while momentum captures short-term trends."
      >
        <ProjectBulletList
          items={[
            'Market making with order book imbalance analysis and adaptive spreads.',
            'Momentum arbitrage using RSI, MACD, and volatility signals to time entries.',
            'Risk controls that throttle exposure during unstable periods.',
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="stack"
        eyebrow="Stack"
        title="Technology"
        subtitle="Core tools used to build the trading system."
      >
        <ProjectTagList items={project.technologies} />
      </ProjectSection>

      <ProjectSection
        id="competition"
        eyebrow="Competition"
        title="High-frequency format"
        subtitle="Five scenario days covering historical, zero-intelligence, and RL agent markets."
      >
        <ProjectStatGrid
          items={[
            { label: 'Teams', value: '22', description: 'International competitors' },
            { label: 'Sessions', value: '6 hours', description: 'Live trading windows' },
            { label: 'Scenarios', value: '5', description: 'Distinct market conditions' },
            { label: 'Platform', value: 'SHIFT', description: 'Stevens trading environment' },
          ]}
        />
      </ProjectSection>

      <ProjectSection
        id="impact"
        eyebrow="Impact"
        title="Technical outcome"
        subtitle="A focused trading system with measurable discipline and speed."
      >
        <ProjectBulletList
          items={[
            'Reliable order execution at sub-second cadence across scenarios.',
            'Adaptive inventory and drawdown controls during volatile periods.',
            'Clear separation of strategy and risk layers for iteration speed.',
          ]}
        />
      </ProjectSection>
    </ProjectPageShell>
  )
}
