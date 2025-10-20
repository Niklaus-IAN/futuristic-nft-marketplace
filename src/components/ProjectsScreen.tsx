import React, { useState } from 'react';
import { Plus, Target, Users, TrendingUp, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface ProjectsScreenProps {
  onCreateProject: () => void;
  onContribute: (projectId: number, amount: number) => void;
  contributedProjects: Set<number>;
}

export function ProjectsScreen({ onCreateProject, onContribute, contributedProjects }: ProjectsScreenProps) {
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MetaMask Wallet');

  // Real crowdfunding projects will be fetched from blockchain/API
  const projects: any[] = [];

  const handleContribute = (project: any) => {
    setSelectedProject(project);
    setShowContributeModal(true);
  };

  const handleSubmitContribution = () => {
    const amount = parseFloat(contributionAmount);
    if (!contributionAmount || amount <= 0) {
      toast.error('Please enter a valid contribution amount');
      return;
    }
    onContribute(selectedProject.id, amount);
    setShowContributeModal(false);
    setContributionAmount('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] pb-32">
      <div className="relative z-10 px-6 pt-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl">Projects</h1>
          <button
            onClick={onCreateProject}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 flex items-center justify-center shadow-[0_0_20px_rgba(138,43,226,0.5)]"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <GlassCard className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-2xl mb-1">156</p>
            <p className="text-white/60 text-xs">Active Projects</p>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl mb-1">12.3K</p>
            <p className="text-white/60 text-xs">Backers</p>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl mb-1">2.4M</p>
            <p className="text-white/60 text-xs">ETH Raised</p>
          </GlassCard>
        </div>

        {/* Featured Projects */}
        <h3 className="text-lg mb-4 text-white/90">Featured Projects</h3>
        
        <div className="space-y-4 mb-8">
          {projects.length === 0 ? (
            <GlassCard className="p-12 text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-xl mb-2">Crowdfunding Coming Soon</h3>
              <p className="text-white/60 mb-6">
                Project crowdfunding features will be available soon
              </p>
              <NeonButton onClick={onCreateProject} variant="outline">
                Be the First to Launch
              </NeonButton>
            </GlassCard>
          ) : (
            projects.map((project) => (
            <GlassCard key={project.id} className="overflow-hidden">
              <div className="relative h-48">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                {/* Project Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="mb-1">{project.title}</h4>
                  <p className="text-white/80 text-sm">by {project.creator}</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{project.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-cyan-400">{project.raised} raised</span>
                    <span className="text-white/60">of {project.goal}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-magenta-500 rounded-full transition-all"
                      style={{ width: `${project.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-4 text-white/60">
                    <span>👥 {project.backers} backers</span>
                    <span>⏱️ {project.daysLeft} days left</span>
                  </div>
                </div>

                <NeonButton onClick={() => handleContribute(project)} className="w-full">
                  {contributedProjects.has(project.id) ? '✓ Contributed' : 'Contribute'}
                </NeonButton>
              </div>
            </GlassCard>
            ))
          )}
        </div>

        {/* Create Project CTA */}
        <GlassCard className="p-8 text-center mb-8" glow>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl mb-2">Launch Your Project</h3>
          <p className="text-white/60 mb-6">
            Get funding for your NFT project and build the future together
          </p>
          <NeonButton onClick={onCreateProject} variant="outline">
            Create Your Project
          </NeonButton>
        </GlassCard>
      </div>

      {/* Contribute Modal */}
      {showContributeModal && selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <GlassCard className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl">Contribute to Project</h3>
              <button onClick={() => setShowContributeModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/60 text-sm mb-6">{selectedProject.title}</p>

            <div className="mb-6">
              <label className="block text-sm text-white/80 mb-2">Contribution Amount (ETH)</label>
              <input
                type="number"
                placeholder="0.00"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
              />
              <div className="flex gap-2 mt-3">
                {['0.1', '0.5', '1.0', '5.0'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setContributionAmount(amount)}
                    className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
                  >
                    {amount} ETH
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-white/80 mb-2">Payment Method</label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white"
              >
                <option>MetaMask Wallet</option>
                <option>Coinbase Wallet</option>
                <option>Credit Card</option>
              </select>
            </div>

            <GlassCard className="p-4 mb-6 bg-cyan-500/5">
              <p className="text-cyan-400 text-sm">
                💡 Contributors receive exclusive project NFTs and early access to features
              </p>
            </GlassCard>

            <div className="flex gap-3">
              <NeonButton onClick={() => setShowContributeModal(false)} variant="secondary" className="flex-1">
                Cancel
              </NeonButton>
              <NeonButton onClick={handleSubmitContribution} className="flex-1">
                Confirm
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
