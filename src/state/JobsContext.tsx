import React, { createContext, useContext, useState, useEffect } from 'react';
import { JobListing, TradeCategory } from '../types/models';
import { FirestoreService, mockJobListings } from '../services/firebase/firestoreService';

interface JobsContextType {
  jobs: JobListing[];
  radiusKm: number;
  selectedCategory: TradeCategory | 'All';
  selectedJob: JobListing | null;
  setRadiusKm: (radius: number) => void;
  setSelectedCategory: (cat: TradeCategory | 'All') => void;
  setSelectedJob: (job: JobListing | null) => void;
  refreshJobs: () => void;
  applyForJob: (jobId: string) => void;
}

const JobsContext = createContext<JobsContextType>({
  jobs: [],
  radiusKm: 10,
  selectedCategory: 'All',
  selectedJob: null,
  setRadiusKm: () => {},
  setSelectedCategory: () => {},
  setSelectedJob: () => {},
  refreshJobs: () => {},
  applyForJob: () => {},
});

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobListing[]>(mockJobListings);
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<TradeCategory | 'All'>('All');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  const refreshJobs = async () => {
    const cat = selectedCategory === 'All' ? undefined : selectedCategory;
    const list = await FirestoreService.getJobs(cat, radiusKm);
    setJobs(list);
  };

  useEffect(() => {
    refreshJobs();
  }, [radiusKm, selectedCategory]);

  const applyForJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, applicantCount: job.applicantCount + 1, status: 'In Progress' } : job
      )
    );
  };

  return (
    <JobsContext.Provider
      value={{
        jobs,
        radiusKm,
        selectedCategory,
        selectedJob,
        setRadiusKm,
        setSelectedCategory,
        setSelectedJob,
        refreshJobs,
        applyForJob,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => useContext(JobsContext);
