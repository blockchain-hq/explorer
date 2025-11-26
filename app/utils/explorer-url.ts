import { clusterSlug, Cluster } from './cluster';

export function getExplorerUrl(address: string, type: 'address' | 'tx', cluster: Cluster): string {
    const clusterParam = cluster !== Cluster.MainnetBeta ? `?cluster=${clusterSlug(cluster)}` : '';
    return `https://explorer.solana.com/${type}/${address}${clusterParam}`;
}

